// src/services/ai.services.ts
import redis from "../config/redis";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";

const AI_MODEL = "gemini-1.5-flash";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const aiModel = genAI.getGenerativeModel({ model: AI_MODEL });

export const extractTextFromPDF = async (fileKey: string): Promise<string> => {
  try {
    const fileData = await redis.get(fileKey);
    if (!fileData) throw new Error("File not found in Redis.");

    let fileBuffer: Uint8Array;
    if (Buffer.isBuffer(fileData)) {
      fileBuffer = new Uint8Array(fileData);
    } else if (typeof fileData === "object" && fileData !== null) {
      const bufferData = fileData as { type?: string; data?: number[] };
      if (bufferData.type === "Buffer" && Array.isArray(bufferData.data)) {
        fileBuffer = new Uint8Array(bufferData.data);
      } else {
        throw new Error("Invalid file data format.");
      }
    } else {
      throw new Error("File data format not recognized.");
    }

    const pdfjs = await import("pdfjs-dist");
    const { getDocument, GlobalWorkerOptions } = pdfjs;
    GlobalWorkerOptions.workerSrc = path.join(
      __dirname,
      "../../node_modules/pdfjs-dist/build/pdf.worker.js"
    );

    const pdf = await getDocument({
      data: fileBuffer,
      disableWorker: true,
    } as any).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return text.trim();
  } catch (error) {
    throw new Error("Failed to extract text from PDF.");
  }
};

export const detectReportType = async (
  aiReportText: string
): Promise<string> => {
  const prompt = `
    Based on the content provided below, classify the type of medical report. Focus on whether it relates to stem cell therapy or general health checkup analysis.
    Provide a concise classification without additional explanation. Examples: "Body Checkup Report", "Stem Cell Report".

    Report Content:
    ${aiReportText.substring(0, 2000)}
  `;

  try {
    const results = await aiModel.generateContent(prompt);
    return results.response?.text().trim() || "Unable to classify report.";
  } catch (error) {
    throw new Error("Failed to detect report type.");
  }
};

export const analyzeReportWithAI = async (aiReportText: string) => {
  const prompt = `
    Analyze the following body checkup report for a patient undergoing or considering stem cell therapy. Provide a structured JSON analysis with:
    1. Potential illnesses or health risks, categorized by severity (low, medium, high).
    2. Health recommendations to mitigate risks and improve overall health.
    3. An assessment of the patient's suitability for stem cell therapy.
    4. Key health metrics critical for evaluating stem cell therapy effectiveness.
    5. A recommendation score (1-100) indicating overall suitability for stem cell therapy.
    
    Important: The recommendationScore must be a number between 1 and 100. Do not return "N/A" or any non-numeric value.

    Format the response as a JSON object with the following structure:
    {
      "healthRisks": [{"risk": "Risk description", "explanation": "Explanation", "severity": "low|medium|high"}],
      "recommendations": [{"recommendation": "Recommendation description", "explanation": "Explanation", "impact": "low|medium|high"}],
      "summary": "Summary of the analysis",
      "criticalMetrics": ["Metric 1", "Metric 2", ...],
      "details": {
        "overview": "Overview of the report",
        "focus": ["Focus 1", "Focus 2", "Focus 3"],
        "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
        "purpose": "Purpose of the report"
      },
      "reportType": "Body Checkup Report",
      "recommendationScore": "Score from 1 to 100"
    }

    Important: Respond only with the JSON object. Do not include any additional text or explanations outside the JSON object.

    Report Content:
    ${aiReportText}
  `;

  try {
    const results = await aiModel.generateContent(prompt);
    let responseText = results.response?.text().trim() || "";

    // Remove any surrounding markdown formatting
    responseText = responseText.replace(/```json\n?|\n?```/g, "").trim();

    // Ensure valid JSON format
    responseText = responseText
      .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Add quotes around keys
      .replace(/:\s*"([^"]*)"([^,}\]])/g, ': "$1"$2') // Fix unquoted values
      .replace(/,\s*}/g, "}"); // Remove trailing commas

    // Validate JSON format
    try {
      const parsedResponse = JSON.parse(responseText);
      return parsedResponse;
    } catch (jsonError) {
      throw new Error("AI response is not valid JSON.");
    }
  } catch (error) {
    throw new Error("Failed to analyze the report with AI.");
  }
};
