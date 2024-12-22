"use client";

import ReportAnalysisResults from "@/components/analysis/analysis-results";
import EmptyState from "@/components/analysis/empty-state";
import { useSubscription } from "@/hooks/use-subscription";
import { api } from "@/lib/api";
import stripePromise from "@/lib/stripe";
import { useReportStore } from "@/store/zustand";
import { toast } from "sonner";

export default function ReportResultsPage() {
  const analysisResults = useReportStore((state) => state.analysisResults);

  const { subscriptionStatus, setLoading } = useSubscription();

  if (!subscriptionStatus) {
    return <div>Loading...</div>;
  }

  const isActive = subscriptionStatus.status === "active";

  const handleUpgrade = async () => {
    setLoading(true);
    if (!isActive) {
      try {
        const response = await api.get("/payments/create-checkout-session");
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
      } catch (error) {
        toast.error("Please try again or login to your account");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("You are already a premium member");
    }
  };

  if (!analysisResults) {
    return <EmptyState title="No Analysis" description="Please try again" />;
  }

  return (
    <ReportAnalysisResults
      therapyId={analysisResults._id}
      isActive={isActive}
      analysisResults={analysisResults}
      onUpgrade={handleUpgrade}
    />
  );
}
