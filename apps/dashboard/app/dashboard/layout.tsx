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
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <MainContent>
          {children}
        </MainContent>
      </div>
    </div>
  );
}
