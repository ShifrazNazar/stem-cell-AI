"use client";

import ReportResults from "./_components/report-results";

export default function ReportPage({ params }: { params: { id: string } }) {
  return <ReportResults reportId={params.id} />;
}
