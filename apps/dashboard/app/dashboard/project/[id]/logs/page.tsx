"use client";
import React, { useEffect, useState } from "react";
import {
    Activity,
    Search,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    RefreshCw,
} from "lucide-react";
import { useParams } from "next/navigation";
import axiosClient from "@/services/axios";

interface LogEntry {
    id: string;
    identifier: string;
    rule: string;
    allowed: boolean;
    count: number;
    createdAt: string;
}

const LogsPage = () => {
    const params = useParams();
    const projectId = params?.id as string;

    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const limit = 15;

    const [statusFilter, setStatusFilter] = useState<"all" | "allowed" | "blocked">("all");
    const [ruleFilter, setRuleFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/tenant/projects/${projectId}/logs`, {
                params: { page, limit, status: statusFilter, rule: ruleFilter || undefined },
            });
            setLogs(res.data.logs);
            setTotalPages(res.data.totalPages);
            setTotalLogs(res.data.total);
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) fetchLogs();
    }, [projectId, page, statusFilter, ruleFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRuleFilter(searchQuery);
            if (page !== 1) setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(date);
    };

    return (
        <div className="max-w-5xl w-full flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">Project</p>
                    <h1 className="text-[18px] font-semibold text-white/90 tracking-tight leading-none">Request Logs</h1>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/25" size={12} />
                    <input
                        type="text"
                        placeholder="Search by rule name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#101012] border border-white/[0.07] h-8 text-[11px] rounded-lg pl-8 pr-3 text-white/80 placeholder-white/25 focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.08] transition-all font-mono w-full sm:w-56"
                    />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
                    {(["all", "allowed", "blocked"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStatusFilter(s); setPage(1); }}
                            className={`h-8 px-3 rounded-lg text-[11px] font-mono capitalize transition-all duration-200 cursor-pointer ${
                                statusFilter === s
                                    ? "bg-white/[0.08] text-white/90 border border-white/[0.12]"
                                    : "text-white/30 hover:text-white/60 border border-transparent hover:bg-white/[0.04]"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                    <button
                        onClick={fetchLogs}
                        disabled={loading}
                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/[0.07] text-white/30 hover:text-white/70 hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                        <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#19191a] border border-white/[0.06] rounded-xl overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 bg-black/20 z-20 flex items-center justify-center">
                        <RefreshCw className="animate-spin text-white/40" size={16} />
                    </div>
                )}

                <div className="overflow-x-auto min-h-[360px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.05]">
                                <th className="py-3 px-4 text-[10px] font-mono font-semibold text-white/30 uppercase tracking-widest">Timestamp</th>
                                <th className="py-3 px-4 text-[10px] font-mono font-semibold text-white/30 uppercase tracking-widest">Identifier</th>
                                <th className="py-3 px-4 text-[10px] font-mono font-semibold text-white/30 uppercase tracking-widest">Rule</th>
                                <th className="py-3 px-4 text-[10px] font-mono font-semibold text-white/30 uppercase tracking-widest">Reqs</th>
                                <th className="py-3 px-4 text-[10px] font-mono font-semibold text-white/30 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-2.5 px-4 whitespace-nowrap">
                                            <span className="text-[11px] font-mono text-white/40 group-hover:text-white/60 transition-colors">
                                                {formatDate(log.createdAt)}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-4 whitespace-nowrap">
                                            <span className="text-[12px] font-mono text-white/75">{log.identifier}</span>
                                        </td>
                                        <td className="py-2.5 px-4 whitespace-nowrap">
                                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] text-white/50 font-mono">
                                                {log.rule}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-4 whitespace-nowrap">
                                            <span className="text-[11px] font-mono text-white/40">{log.count}</span>
                                        </td>
                                        <td className="py-2.5 px-4 whitespace-nowrap text-right">
                                            {log.allowed ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/[0.07] border border-emerald-500/[0.15] text-emerald-400/70 text-[10px] font-mono">
                                                    <CheckCircle2 size={9} />allowed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/[0.07] border border-red-500/[0.15] text-red-400/70 text-[10px] font-mono">
                                                    <XCircle size={9} />blocked
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                !loading && (
                                    <tr>
                                        <td colSpan={5} className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Activity className="text-white/15" size={20} />
                                                <p className="text-[11px] font-mono text-white/25">no logs found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.length > 0 && (
                    <div className="border-t border-white/[0.05] px-4 py-2.5 flex items-center justify-between">
                        <p className="text-[10px] font-mono text-white/25">
                            {(page - 1) * limit + 1}–{Math.min(page * limit, totalLogs)} of {totalLogs} entries
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.07] text-white/30 hover:bg-white/[0.04] hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                <ChevronLeft size={12} />
                            </button>
                            <span className="text-[10px] font-mono text-white/30 px-1">{page} / {totalPages || 1}</span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || totalPages === 0}
                                className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.07] text-white/30 hover:bg-white/[0.04] hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                <ChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogsPage;
