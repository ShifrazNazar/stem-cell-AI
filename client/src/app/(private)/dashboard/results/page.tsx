"use client";

import ReportAnalysisResults from "@/components/analysis/analysis-results";
import EmptyState from "@/components/analysis/empty-state";
import { useReportStore } from "@/store/zustand";
import { toast } from "sonner";

export default function ReportResultsPage() {
  const analysisResults = useReportStore((state) => state.analysisResults);

  const handleUpgrade = async () => {
    try {
      toast.success("Upgrade functionality can be added here.");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  if (!analysisResults) {
    return <EmptyState title="No Analysis" description="Please try again" />;
  }

  return (
    <ReportAnalysisResults
      therapyId={analysisResults._id}
      analysisResults={analysisResults}
      onUpgrade={handleUpgrade}
    />
  );
}
