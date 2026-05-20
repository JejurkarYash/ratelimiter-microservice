"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
    Activity,
    ShieldAlert,
    Zap,
    RefreshCw,
    Trash2,
    Edit2,
    CheckCircle2,
    Plus,
    Key,
} from "lucide-react";
import axiosClient from "@/services/axios";

const ProjectOverview = () => {
    const params = useParams();
    const projectId = params?.id;
    const searchParams = useSearchParams();
    const projectName = searchParams.get("name");

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchOverview = async () => {
        try {
            const res = await axiosClient.get(`/tenant/projects/${projectId}/overview`);
            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch project overview", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) fetchOverview();
    }, [projectId]);



    const handleNewruleButton = () => {
        window.location.href = `/dashboard/project/${projectId}/rules?name=${projectName}`
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-64 text-white/50">
                <RefreshCw className="animate-spin mr-2" size={16} /> Loading overview...
            </div>
        );
    }

    if (!data) return <div className="text-white/50">Failed to load project data.</div>;

    const { project, stats, topBlockedRules, recentActivity, rules } = data;

    const allowedPercent = stats.totalRequests === 0 ? 0 : ((stats.allowedRequests / stats.totalRequests) * 100).toFixed(1);
    const blockedPercent = stats.totalRequests === 0 ? 0 : ((stats.blockedRequests / stats.totalRequests) * 100).toFixed(1);

    return (
        <div className="max-w-5xl w-full flex flex-col gap-5">

            {/* ── Top Card: Project Header ── */}
            <div className="relative bg-[#19191a] border border-white/[0.06] rounded-xl p-5 overflow-hidden">
                {/* Top edge accent */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="flex items-center justify-between">
                    {/* Left: name + masked key */}
                    <div className="flex flex-col gap-1.5">
                        <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Overview</p>
                        <h1 className="text-[18px] font-semibold text-white/90 tracking-tight leading-none">
                            {project.name}
                        </h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Key size={10} className="text-white/25 shrink-0" />
                            <span className="text-[11px] text-white/30 font-mono tracking-wider">
                                {project.apiKeyMasked}
                            </span>
                        </div>
                    </div>

                    {/* Right: active badge */}
                    {project.isActive ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                            </span>
                            <span className="text-[10px] font-medium text-primary/70">Active</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03]">
                            <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                            <span className="text-[10px] font-medium text-white/35">Paused</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Total Requests */}
                <div className="group relative bg-[#19191a] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-4 flex flex-col gap-3 overflow-hidden transition-all duration-300">
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-400/10 flex items-center justify-center shrink-0">
                            <Activity size={12} className="text-blue-400/70" />
                        </div>
                        <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Requests</span>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-white/85">{stats.totalRequests.toLocaleString()}</p>
                        <p className="text-[10px] text-white/25 mt-1 font-mono">today</p>
                    </div>
                </div>

                {/* Allowed */}
                <div className="group relative bg-[#19191a] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-4 flex flex-col gap-3 overflow-hidden transition-all duration-300">
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-400/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={12} className="text-emerald-400/70" />
                        </div>
                        <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Allowed</span>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-white/85">{stats.allowedRequests.toLocaleString()}</p>
                        <p className="text-[10px] text-emerald-400/50 mt-1 font-mono">{allowedPercent}% of total</p>
                    </div>
                </div>

                {/* Blocked */}
                <div className="group relative bg-[#19191a] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-4 flex flex-col gap-3 overflow-hidden transition-all duration-300">
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-red-400/10 flex items-center justify-center shrink-0">
                            <ShieldAlert size={12} className="text-red-400/70" />
                        </div>
                        <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Blocked</span>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-white/85">{stats.blockedRequests.toLocaleString()}</p>
                        <p className="text-[10px] text-red-400/50 mt-1 font-mono">{blockedPercent}% of total</p>
                    </div>
                </div>

                {/* Avg Latency */}
                <div className="group relative bg-[#19191a] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-4 flex flex-col gap-3 overflow-hidden transition-all duration-300">
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-amber-400/10 flex items-center justify-center shrink-0">
                            <Zap size={12} className="text-amber-400/70" />
                        </div>
                        <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Latency</span>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-white/85">3.2ms</p>
                        <p className="text-[10px] text-white/25 mt-1 font-mono">p95: 8ms</p>
                    </div>
                </div>
            </div>

            {/* ── 2 Columns: Top Blocked & Recent Activity ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Top Blocked Rules */}
                <div className="bg-[#19191a] border border-white/[0.06] rounded-xl p-4 flex flex-col">
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-4">Top Blocked Rules</p>
                    <div className="flex flex-col gap-1">
                        {topBlockedRules.length === 0 ? (
                            <p className="text-[12px] text-white/25 py-4 text-center font-mono">No blocks recorded today</p>
                        ) : (
                            topBlockedRules.map((r: any, i: number) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                                    <span className="text-[12px] text-white/60 font-mono">{r.rule}</span>
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/[0.08] border border-red-500/[0.15] text-[10px] font-medium text-red-400/70 font-mono">
                                        {r.count} blocked
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#19191a] border border-white/[0.06] rounded-xl p-4 flex flex-col">
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-4">Recent Activity</p>
                    <div className="flex flex-col gap-1">
                        {recentActivity.length === 0 ? (
                            <p className="text-[12px] text-white/25 py-4 text-center font-mono">No recent activity</p>
                        ) : (
                            recentActivity.map((log: any, i: number) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                                    <span className="text-[12px] text-white/60 font-mono">{log.identifier}</span>
                                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md border font-mono ${log.allowed
                                            ? "bg-emerald-500/[0.08] border-emerald-500/[0.15] text-emerald-400/70"
                                            : "bg-red-500/[0.08] border-red-500/[0.15] text-red-400/70"
                                        }`}>
                                        {log.allowed ? "Allowed" : "Blocked"}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ── Rules List ── */}
            <div className="bg-[#19191a] border border-white/[0.06] rounded-xl overflow-hidden flex flex-col">
                <div className="px-4 py-3.5 border-b border-white/[0.05] flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-0.5">Project</p>
                        <h3 className="text-[13px] font-semibold text-white/85 tracking-wide leading-none">
                            Rules
                            <span className="ml-2 text-[10px] text-white/25 font-mono font-normal">({rules.length})</span>
                        </h3>
                    </div>
                    <button
                        onClick={handleNewruleButton}
                        className="flex items-center gap-1.5 bg-primary/90 hover:bg-primary text-white px-3 py-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer shrink-0"
                    >
                        <Plus size={12} />
                        New Rule
                    </button>
                </div>

                <div className="flex flex-col gap-2 p-3">
                    {rules.length === 0 ? (
                        <p className="text-[12px] text-white/25 py-8 text-center font-mono">No rules configured for this project.</p>
                    ) : (
                        rules.map((rule: any) => (
                            <div
                                key={rule.id}
                                className="group relative flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#101012] hover:border-white/[0.12] transition-all duration-300 px-4 py-3 overflow-hidden"
                            >
                                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Name */}
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                        <ShieldAlert size={11} className="text-primary/70" />
                                    </div>
                                    <span className="text-[13px] font-semibold text-white/85 font-mono tracking-wide truncate">{rule.name}</span>
                                </div>

                                {/* Pills */}
                                <div className="flex items-center gap-1.5 shrink-0 mx-4">
                                    <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] text-[9.5px] text-white/40 font-mono">
                                        {rule.limit} req / {rule.window}s
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[9.5px] text-white/30 font-mono uppercase">
                                        {rule.algorithm === "FIXED_WINDOW" ? "Fixed" : "Sliding"}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <button className="text-white/20 hover:text-white/60 transition-colors p-1 cursor-pointer">
                                        <Edit2 size={13} />
                                    </button>
                                    <button className="text-white/20 hover:text-red-400/70 transition-colors p-1 cursor-pointer">
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default ProjectOverview;