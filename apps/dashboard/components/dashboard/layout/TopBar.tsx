"use client";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Workflow } from "lucide-react";
import UserAvatar from "./UserAvatar";

const TopBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const segments = pathname?.split("/").filter(Boolean) || [];
  const isProjectRoute =
    segments[0] === "dashboard" && segments[1] === "project" && segments[2];

  const urlName = searchParams.get("name");
  const projectName = urlName
    ? urlName
    : isProjectRoute
      ? "Project Settings"
      : null;

  return (
    <header className="flex items-center justify-between h-[52px] min-h-[52px] px-4 bg-dashboard-primary border-b border-white/10">
      {/* Left section — Branding & Breadcrumb */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Logo + App Name */}
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Throttlr<span className="text-primary">.</span>
          </h1>
        </div>

        {/* Divider */}
        <span className="text-lg font-light text-white/20">/</span>

        {/* Context Selector / Workspace */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5 transition-colors duration-200 group"
        >
          <div className="flex items-center justify-center w-5 h-5 rounded bg-dashboard-card border border-white/10 text-xs font-medium text-white group-hover:border-white/20 transition-colors">
            Y
          </div>
          <span
            className={`text-sm font-medium transition-colors ${projectName ? "text-white/60 group-hover:text-white" : "text-white/90 group-hover:text-white"}`}
          >
            Yash's Workspace
          </span>
          {!projectName && (
            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          )}
        </Link>

        {/* Dynamic Project Breadcrumb */}
        {projectName && (
          <>
            <span className="text-lg font-light text-white/20">/</span>
            <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5 transition-colors duration-200 group hover:cursor-pointer">
              <span className="text-white/60">
                <Workflow size={16} />
              </span>
              <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                {projectName}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Right section — Search + Actions */}
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <UserAvatar />
      </div>
    </header>
  );
};

export default TopBar;
