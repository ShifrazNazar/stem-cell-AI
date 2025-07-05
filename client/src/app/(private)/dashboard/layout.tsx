import { ProtectedLayout } from "@/components/dashboard/protected-layout";
import DashboardLayout from "@/components/dashboard/sidebar";
import { Header } from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      <Header />
      <DashboardLayout>
        <main className="flex-1 overflow-x-hidden bg-white overflow-y-auto p-6">
          {children}
        </main>
      </DashboardLayout>
    </ProtectedLayout>
  );
}
