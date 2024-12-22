interface Risk {
  _id: string;
  risk: string;
  explanation: string;
  severity: "low" | "medium" | "high";
}

interface Recommendation {
  _id: string;
  recommendation: string;
  explanation: string;
  impact: "low" | "medium" | "high";
}

interface Details {
  overview: string;
  focus: string[];
  highlights: string[];
  purpose: string;
}

export interface BodyCheckupAnalysis {
  _id: string;
  userId: string;
  healthRisks: Risk[];
  recommendations: Recommendation[];
  summary: string;
  criticalMetrics: string[];
  details: Details;
  recommendationScore: number;
  reportType: string;
  createdAt: string;
  version: number;
  aiModel: string;
  language: string;
}
