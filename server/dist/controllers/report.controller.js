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
exports.getReportByID = exports.getUserReports = exports.analyzeReport = exports.detectAndConfirmReportType = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const redis_1 = __importDefault(require("../config/redis"));
const ai_services_1 = require("../services/ai.services");
const report_model_1 = __importDefault(require("../models/report.model"));
const mongoUtils_1 = require("../utils/mongoUtils");
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        }
        else {
            cb(null, false);
            cb(new Error("Only pdf files are allowed"));
        }
    },
}).single("report");
exports.uploadMiddleware = upload;
const detectAndConfirmReportType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    try {
        const fileKey = `file:${user._id}:${Date.now()}`;
        yield redis_1.default.set(fileKey, req.file.buffer);
        yield redis_1.default.expire(fileKey, 3600); // 1 hour
        const pdfText = yield (0, ai_services_1.extractTextFromPDF)(fileKey);
        const detectedType = yield (0, ai_services_1.detectReportType)(pdfText);
        yield redis_1.default.del(fileKey);
        res.json({ detectedType });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to detect report type" });
    }
});
exports.detectAndConfirmReportType = detectAndConfirmReportType;
const analyzeReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { reportType } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    if (!reportType) {
        return res.status(400).json({ error: "No report type provided" });
    }
    try {
        const fileKey = `file:${user._id}:${Date.now()}`;
        yield redis_1.default.set(fileKey, req.file.buffer);
        yield redis_1.default.expire(fileKey, 3600); // 1 hour
        const pdfText = yield (0, ai_services_1.extractTextFromPDF)(fileKey);
        let analysis;
        analysis = yield (0, ai_services_1.analyzeReportWithAI)(pdfText);
        const savedAnalysis = yield report_model_1.default.create(Object.assign(Object.assign({ userId: user._id, aiReportText: pdfText, reportType }, analysis), { language: "en", aiModel: "gemini-pro" }));
        res.json(savedAnalysis);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to analyze report" });
    }
});
exports.analyzeReport = analyzeReport;
const getUserReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const query = { userId: user._id };
        const reports = yield report_model_1.default.find(query).sort({ createdAt: -1 });
        res.json(reports);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to get reports" });
    }
});
exports.getUserReports = getUserReports;
const getReportByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    if (!(0, mongoUtils_1.isValidMongoId)(id)) {
        return res.status(400).json({ error: "Invalid report ID" });
    }
    try {
        const cachedReports = yield redis_1.default.get(`report:${id}`);
        if (cachedReports) {
            return res.json(cachedReports);
        }
        //if not in cache, get from db
        const report = yield report_model_1.default.findOne({
            _id: id,
            userId: user._id,
        });
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }
        //Cache the results for future requests
        yield redis_1.default.set(`report:${id}`, report, { ex: 3600 }); // 1 hour
        res.json(report);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get report" });
    }
});
exports.getReportByID = getReportByID;
