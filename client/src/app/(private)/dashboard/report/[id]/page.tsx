"use client";

import ReportResults from "./_components/report-results";

interface IReportResultsProps {
  params: { id: string };
}

export default function ReportPage({ params: { id } }: IReportResultsProps) {
  return <ReportResults reportId={id} />;
}
