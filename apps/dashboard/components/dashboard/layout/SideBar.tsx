"use client";
import React from "react";
import {
    LayoutGrid,
    Shield,
    Key,
    Settings,
    BarChart2,
    ScrollText,
    ArrowLeft
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

const SideBar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Detect if we are inside a specific project
    const segments = pathname?.split("/").filter(Boolean) || [];
    const isProjectRoute = segments[0] === "dashboard" && segments[1] === "project" && segments[2];
    const projectId = isProjectRoute ? segments[2] : null;
    const projectName = searchParams.get("name") || "";
    const nameQuery = projectName ? `?name=${encodeURIComponent(projectName)}` : "";

    // Workspace Level Navigation
    const workspaceItems = [
        { icon: <LayoutGrid size={20} />, label: "Projects", href: "/dashboard" },
        { icon: <Settings size={20} />, label: "Settings", href: "/dashboard/settings" },
    ];

    // Project Level Navigation
    // Note: The main Project URL is treated as the "Rules" or "Overview" page.
    const projectItems = projectId ? [
        { icon: <ArrowLeft size={20} />, label: "Back to Projects", href: "/dashboard" },
        { icon: <LayoutGrid size={20} />, label: "Overview", href: `/dashboard/project/${projectId}${nameQuery}` },
        { icon: <Shield size={20} />, label: "Rules", href: `/dashboard/project/${projectId}/rules${nameQuery}` },
        { icon: <Key size={20} />, label: "API Keys", href: `/dashboard/project/${projectId}/api${nameQuery}` },
        { icon: <BarChart2 size={20} />, label: "Usage", href: `/dashboard/project/${projectId}/usage${nameQuery}` },
        { icon: <ScrollText size={20} />, label: "Logs", href: `/dashboard/project/${projectId}/logs${nameQuery}` },
        { divider: true },
        { icon: <Settings size={20} />, label: "Settings", href: `/dashboard/project/${projectId}/settings${nameQuery}` },
    ] : [];

    const navItems = isProjectRoute ? projectItems : workspaceItems;

    return (
        <aside className="relative w-[64px] min-w-[64px] shrink-0 h-full z-40">
            <nav className="absolute top-0 left-0 h-full w-[64px] hover:w-[240px] group/sidebar bg-dashboard-primary border-r border-white/10 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col py-4 shadow-2xl overflow-hidden">

                <div className="flex flex-col gap-2 px-3">
                    {navItems.map((item, index) => {
                        // @ts-ignore
                        if (item.divider) {
                            return <div key={`divider-${index}`} className="h-px bg-white/10 my-2 mx-2" />;
                        }

                        // Exact match for highlighted states, ignoring any query parameters like ?name=...
                        const itemBasePath = item.href?.split('?')[0];
                        const isActive = pathname === itemBasePath;

                        return (
                            <Link
                                key={item.label}
                                href={item.href!}
                                className={`
                                    flex items-center h-10 rounded-lg px-2.5 transition-colors duration-200 relative
                                    ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-white/50 hover:bg-white/5 hover:text-white/90"
                                    }
                                `}
                            >
                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-md" />
                                )}

                                <div className="flex items-center justify-center w-5 min-w-[20px]">
                                    {item.icon}
                                </div>

                                <span className={`
                                    ml-3 text-sm font-medium whitespace-nowrap 
                                    opacity-0 -translate-x-2 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 
                                    transition-all duration-300 ease-out pointer-events-none
                                `}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </aside>
    );
};

export default SideBar