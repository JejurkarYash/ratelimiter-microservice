"use client";
import { Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/dashboard/layout/SideBar";
import TopBar from "@/components/dashboard/layout/TopBar";
import MainContent from "@/components/dashboard/layout/MainContent";
import { RefreshCw } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dashboard-primary text-white">
        <RefreshCw className="animate-spin text-[#F97316]" size={24} />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

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
