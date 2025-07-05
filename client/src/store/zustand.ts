import { create } from "zustand";

interface ReportStore {
  analysisResults: any;
  setAnalysisResults: (results: any) => void;
}

const useReportStore = create<ReportStore>((set) => ({
  analysisResults: undefined,
  setAnalysisResults: (results) => set({ analysisResults: results }),
}));

export { useReportStore };
