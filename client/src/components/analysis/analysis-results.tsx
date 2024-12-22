import { BodyCheckupAnalysis } from "@/interfaces/body-checkup.interface";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import OverallScoreChart from "./chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";

interface IBodyCheckupAnalysisResultsProps {
  analysisResults: BodyCheckupAnalysis;
  isActive: boolean;
  therapyId: string;
  onUpgrade: () => void;
}

export default function BodyCheckupAnalysisResults({
  analysisResults,
  isActive,
}: IBodyCheckupAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState("summary");

  if (!analysisResults) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No analysis results available.</p>
      </div>
    );
  }

  const getScore = () => {
    const score = analysisResults.recommendationScore;
    if (score > 70)
      return { icon: ArrowUp, color: "text-green-500", text: "Good" };
    if (score < 50)
      return { icon: ArrowDown, color: "text-red-500", text: "Bad" };
    return { icon: Minus, color: "text-yellow-500", text: "Average" };
  };

  const scoreTrend = getScore();

  const getBadgeClass = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderRisksAndRecommendations = (
    items: Array<{
      _id?: string;
      risk?: string;
      recommendation?: string;
      explanation?: string;
      severity?: string;
      impact?: string;
    }>,
    type: "risks" | "recommendations"
  ) => {
    const displayItems = isActive ? items : items.slice(0, 3);

    return (
      <ul className="space-y-4">
        {displayItems.length === 0 && (
          <li className="text-gray-500">No {type} available</li>
        )}
        {displayItems.map((item, index) => (
          <motion.li
            key={index}
            className="border rounded-lg p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start">
              <span className="font-semibold text-lg">
                {type === "risks"
                  ? item.risk || "Unknown Risk"
                  : item.recommendation || "Unknown Recommendation"}
              </span>
              {(item.severity || item.impact) && (
                <Badge
                  className={getBadgeClass(item.severity || item.impact || "")}
                >
                  {item.severity || item.impact}
                </Badge>
              )}
            </div>
            <p className="mt-2 text-gray-600">
              {item.explanation || "No additional explanation provided."}
            </p>
          </motion.li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Analysis Results</h1>
        <div>{/* Add any interactive buttons or actions */}</div>
      </header>

      {/* Overall Score Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Therapy Score</CardTitle>
          <CardDescription>
            Evaluation based on identified risks and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-5xl font-bold">
                  {analysisResults.recommendationScore ?? 0}
                </div>
                <div className={`flex items-center ${scoreTrend.color}`}>
                  <scoreTrend.icon className="w-6 h-6 mr-1" />
                  <span className="font-semibold">{scoreTrend.text}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Risk Level</span>
                  <span>{100 - analysisResults.recommendationScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Recommendations</span>
                  <span>{analysisResults.recommendationScore}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                This score represents the combined assessment of risks and
                recommendations.
              </p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <OverallScoreChart
                overallScore={analysisResults.recommendationScore}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                {analysisResults.summary}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle>Health Risks</CardTitle>
            </CardHeader>
            <CardContent>
              {renderRisksAndRecommendations(
                analysisResults.healthRisks,
                "risks"
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {renderRisksAndRecommendations(
                analysisResults.recommendations,
                "recommendations"
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Details Section */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                  {/* Overview Section */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Overview
                    </h3>
                    <p>{analysisResults.details.overview}</p>
                  </div>

                  {/* Focus Areas */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Focus Areas
                    </h3>
                    <ul className="list-disc pl-6">
                      {analysisResults.details.focus.map((item, index) => (
                        <li key={index} className="text-gray-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Highlights
                    </h3>
                    <ul className="list-disc pl-6">
                      {analysisResults.details.highlights.map((item, index) => (
                        <li key={index} className="text-gray-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Purpose Section */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Purpose
                    </h3>
                    <p>{analysisResults.details.purpose}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Critical Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResults.criticalMetrics.map((metric, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center p-3 border rounded-md shadow-sm bg-gray-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                    >
                      <span className="text-gray-800">{metric}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
