import { Request, Response } from "express";
import multer from "multer";
import { IUser } from "../models/user.model";
import redis from "../config/redis";
import {
  analyzeReportWithAI,
  detectReportType,
  extractTextFromPDF,
} from "../services/ai.services";
import ReportAnalysisSchema, {
  IBodyCheckupAnalysis,
} from "../models/report.model";
import mongoose, { FilterQuery } from "mongoose";
import { isValidMongoId } from "../utils/mongoUtils";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("Only pdf files are allowed"));
    }
  },
}).single("report");

export const uploadMiddleware = upload;

export const detectAndConfirmReportType = async (
  req: Request,
  res: Response
) => {
  const user = req.user as IUser;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const fileKey = `file:${user._id}:${Date.now()}`;
    await redis.set(fileKey, req.file.buffer);

    await redis.expire(fileKey, 3600); // 1 hour

    const pdfText = await extractTextFromPDF(fileKey);
    const detectedType = await detectReportType(pdfText);

    await redis.del(fileKey);

    res.json({ detectedType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to detect report type" });
  }
};

export const analyzeReport = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { reportType } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (!reportType) {
    return res.status(400).json({ error: "No report type provided" });
  }

  try {
    const fileKey = `file:${user._id}:${Date.now()}`;
    await redis.set(fileKey, req.file.buffer);
    await redis.expire(fileKey, 3600); // 1 hour

    const pdfText = await extractTextFromPDF(fileKey);
    let analysis;

    analysis = await analyzeReportWithAI(pdfText);

    const savedAnalysis = await ReportAnalysisSchema.create({
      userId: user._id,
      aiReportText: pdfText,
      reportType,
      ...(analysis as Partial<IBodyCheckupAnalysis>),
      language: "en",
      aiModel: "gemini-pro",
    });

    res.json(savedAnalysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze report" });
  }
};

export const getUserReports = async (req: Request, res: Response) => {
  const user = req.user as IUser;

  try {
    interface QueryType {
      userId: mongoose.Types.ObjectId;
    }

    const query: QueryType = { userId: user._id as mongoose.Types.ObjectId };
    const reports = await ReportAnalysisSchema.find(
      query as FilterQuery<IBodyCheckupAnalysis>
    ).sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get reports" });
  }
};

export const getReportByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as IUser;

  if (!isValidMongoId(id)) {
    return res.status(400).json({ error: "Invalid report ID" });
  }

  try {
    const cachedReports = await redis.get(`report:${id}`);
    if (cachedReports) {
      return res.json(cachedReports);
    }

    //if not in cache, get from db
    const report = await ReportAnalysisSchema.findOne({
      _id: id,
      userId: user._id,
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    //Cache the results for future requests
    await redis.set(`report:${id}`, report, { ex: 3600 }); // 1 hour

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get report" });
  }
};
