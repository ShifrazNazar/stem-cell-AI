"use client";

import ReportResults from "./_components/report-results";

export default function ReportPage(props: any) {
  return <ReportResults reportId={props.params.id} />;
}
