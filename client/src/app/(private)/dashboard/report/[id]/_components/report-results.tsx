"use client";

import ReportAnalysisResults from "@/components/analysis/analysis-results";
import { useCurrentUser } from "@/hooks/use-current-user";
import { BodyCheckupAnalysis } from "@/interfaces/body-checkup.interface";
import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface IReportResultsProps {
  reportId: string;
}

export default function ReportResults({ reportId }: IReportResultsProps) {
  const { user } = useCurrentUser();
  const [analysisResults, setAnalysisResults] = useState<BodyCheckupAnalysis>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      fetchAnalysisResults(reportId);
    }
  }, [user, reportId]);

  const fetchAnalysisResults = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/reports/report/${id}`);
      setAnalysisResults(response.data);
      console.log(response.data);
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return notFound();
  }

  if (!analysisResults) {
    return <div>Loading...</div>;
  }

  return (
    <ReportAnalysisResults
      therapyId={reportId}
      analysisResults={analysisResults}
      onUpgrade={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}
