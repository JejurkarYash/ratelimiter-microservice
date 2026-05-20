"use client";
import Link from "next/link";
import { ShieldAlert, Zap, Shield } from "lucide-react";
import { Project } from "@/types/project";

const ProjectCard = ({ project }: { project: Project }) => {
    return (
        <Link
            href={`/dashboard/project/${project.id}?name=${encodeURIComponent(project.name)}`}
            className="group relative flex flex-col justify-between rounded-xl border border-white/[0.06] bg-project-card hover:border-white/[0.12] transition-all duration-300 p-5 cursor-pointer w-full overflow-hidden"
        >
            {/* Subtle top-edge accent on hover */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-white/90 tracking-tight leading-tight">
                        {project.name}
                    </h3>
                    <span className="text-[11px] text-white/30 font-mono">
                        {project.apiKeyMasked}
                    </span>
                </div>

                {/* Status badge — top right */}
                {project.isActive ? (
                    <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-full border border-primary/20 bg-primary/5">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        <span className="text-[10px] font-medium text-primary/70">Active</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-full border border-white/10 bg-white/[0.03]">
                        <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                        <span className="text-[10px] font-medium text-white/35">Paused</span>
                    </div>
                )}
            </div>

            {/* ── Divider ── */}
            <div className="w-full h-px bg-white/[0.05] my-4" />

            {/* ── Stats row ── */}
            <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-white/30">
                        <Zap size={11} className="text-primary/50" />
                        <span className="text-[10px]">Requests</span>
                    </div>
                    <span className="text-sm font-semibold text-white/80">
                        {project.requestsToday.toLocaleString()}
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-white/30">
                        <ShieldAlert size={11} className="text-red-400/60" />
                        <span className="text-[10px]">Blocked</span>
                    </div>
                    <span className="text-sm font-semibold text-white/80">
                        {project.blockedToday.toLocaleString()}
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-white/30">
                        <Shield size={11} className="text-white/25" />
                        <span className="text-[10px]">Rules</span>
                    </div>
                    <span className="text-sm font-semibold text-white/80">
                        {project.rulesCount}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;