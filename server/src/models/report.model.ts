// src/models/report.model.ts
import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.model";

interface IRisk {
  risk: string;
  explanation: string;
  severity: "low" | "medium" | "high";
}

interface IRecommendation {
  opportunity: string;
  explanation: string;
  impact: "low" | "medium" | "high";
}

interface IDetails {
  overview: string;
  focus: string[];
  highlights: string[];
  purpose: string;
}

export interface IBodyCheckupAnalysis extends Document {
  userId: IUser["_id"];
  healthRisks: IRisk[];
  recommendations: IRecommendation[];
  summary: string;
  criticalMetrics: string[];
  details: IDetails;
  recommendationScore: number;
  createdAt: Date;
}

const BodyCheckupAnalysisSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  healthRisks: [{ risk: String, explanation: String, severity: String }],
  recommendations: [
    { recommendation: String, explanation: String, impact: String },
  ],
  summary: { type: String },
  criticalMetrics: [{ type: String }],
  details: {
    overview: { type: String },
    focus: [{ type: String }],
    highlights: [{ type: String }],
    purpose: { type: String },
  },
  recommendationScore: { type: Number, min: 0, max: 100 },
  reportType: { type: String },
  language: { type: String, default: "en" },
  aiModel: { type: String, default: "gemini-pro" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBodyCheckupAnalysis>(
  "BodyCheckupAnalysis",
  BodyCheckupAnalysisSchema
);
