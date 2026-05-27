import { Suspense } from "react";
import SideBar from "@/components/dashboard/layout/SideBar";
import TopBar from "@/components/dashboard/layout/TopBar";
import MainContent from "@/components/dashboard/layout/MainContent";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-primary overflow-hidden">
      <Suspense fallback={<div className="h-[52px] bg-dashboard-primary border-b border-white/10" />}>
        <TopBar />
      </Suspense>
      <div className="flex flex-1 overflow-hidden">
        <Suspense fallback={<div className="w-64 bg-dashboard-primary border-r border-white/10" />}>
          <SideBar />
        </Suspense>
        <MainContent>
          <Suspense fallback={<div className="flex-1 p-6 text-white">Loading...</div>}>
            {children}
          </Suspense>
        </MainContent>
      </div>
    </div>
  );
}
