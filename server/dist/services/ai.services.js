"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeReportWithAI = exports.detectReportType = exports.extractTextFromPDF = void 0;
// src/services/ai.services.ts
const redis_1 = __importDefault(require("../config/redis"));
const pdfjs_dist_1 = require("pdfjs-dist");
const generative_ai_1 = require("@google/generative-ai");
const AI_MODEL = "gemini-pro";
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: AI_MODEL });
const extractTextFromPDF = (fileKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileData = yield redis_1.default.get(fileKey);
        if (!fileData) {
            throw new Error("File not found in Redis.");
        }
        let fileBuffer;
        if (Buffer.isBuffer(fileData)) {
            fileBuffer = new Uint8Array(fileData);
        }
        else if (typeof fileData === "object" && fileData !== null) {
            const bufferData = fileData;
            if (bufferData.type === "Buffer" && Array.isArray(bufferData.data)) {
                fileBuffer = new Uint8Array(bufferData.data);
            }
            else {
                throw new Error("Invalid file data format.");
            }
        }
        else {
            throw new Error("File data format not recognized.");
        }
        const pdf = yield (0, pdfjs_dist_1.getDocument)({ data: fileBuffer }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = yield pdf.getPage(i);
            const content = yield page.getTextContent();
            text += content.items.map((item) => item.str).join(" ") + "\n";
        }
        return text.trim();
    }
    catch (error) {
        console.error("Error in extractTextFromPDF:", error);
        throw new Error("Failed to extract text from PDF.");
    }
});
exports.extractTextFromPDF = extractTextFromPDF;
const detectReportType = (aiReportText) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const prompt = `
    Based on the content provided below, classify the type of medical report. Focus on whether it relates to stem cell therapy or general health checkup analysis.
    Provide a concise classification without additional explanation. Examples: "Body Checkup Report", "Stem Cell Report".

    Report Content:
    ${aiReportText.substring(0, 2000)}
  `;
    try {
        const results = yield aiModel.generateContent(prompt);
        return ((_a = results.response) === null || _a === void 0 ? void 0 : _a.text().trim()) || "Unable to classify report.";
    }
    catch (error) {
        console.error("Error in detectReportType:", error);
        throw new Error("Failed to detect report type.");
    }
});
exports.detectReportType = detectReportType;
const analyzeReportWithAI = (aiReportText) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const prompt = `
    Analyze the following body checkup report for a patient undergoing or considering stem cell therapy. Provide a structured JSON analysis with:
    1. Potential illnesses or health risks, categorized by severity (low, medium, high).
    2. Health recommendations to mitigate risks and improve overall health.
    3. An assessment of the patient's suitability for stem cell therapy.
    4. Key health metrics critical for evaluating stem cell therapy effectiveness.
    5. A recommendation score (1-100) indicating overall suitability for stem cell therapy.

    Format the response as:
    {
      "healthRisks": [{"risk": "Risk description",explanation": "Explanation", "severity": "low|medium|high"}],
      "recommendations": [{"recommendation": "Recommendation description", "explanation": "Explanation", "impact": "low|medium|high"}],
      "summary": "Summary of the analysis",
      "criticalMetrics": ["Metric 1", "Metric 2", ...],
      "details": {
        "overview": "Overview of the report",
        "focus": [
          "Focus 1",
          "Focus 2",
          "Focus 3"
        ],
        "highlights": [
          "Highlight 1",
          "Highlight 2",
          "Highlight 3"
        ],
        "purpose": "Purpose of the report"
      },
      "reportType": "Body Checkup Report,
      "recommendationScore": "Score from 1 to 100",
    }

    Important: Respond only with the JSON object.

    Report Content:
    ${aiReportText}
  `;
    try {
        const results = yield aiModel.generateContent(prompt);
        let responseText = ((_a = results.response) === null || _a === void 0 ? void 0 : _a.text().trim()) || "";
        // Remove any surrounding markdown formatting
        responseText = responseText.replace(/```json\n?|\n?```/g, "").trim();
        // Ensure valid JSON format
        responseText = responseText
            .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
            .replace(/:\s*"([^"]*)"([^,}\]])/g, ': "$1"$2')
            .replace(/,\s*}/g, "}");
        console.log(responseText);
        return JSON.parse(responseText);
    }
    catch (error) {
        console.error("Error in analyzeReportWithAI:", error);
        throw new Error("Failed to analyze the report with AI.");
    }
});
exports.analyzeReportWithAI = analyzeReportWithAI;
