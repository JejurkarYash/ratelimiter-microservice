"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Activity,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
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

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const limit = 15;

  // Filters
  const [statusFilter, setStatusFilter] = useState<
    "all" | "allowed" | "blocked"
  >("all");
  const [ruleFilter, setRuleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Debounced rule search

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/tenant/projects/${projectId}/logs`, {
        params: {
          page,
          limit,
          status: statusFilter,
          rule: ruleFilter || undefined,
        },
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

  // Format date string to display
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setRuleFilter(searchQuery);
      if (page !== 1) setPage(1); // reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            API Request Logs
          </h1>
          <p className="text-sm text-white/50">
            Detailed audit trail of all rate limiting decisions made for your
            project.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#101012] border border-white/5 rounded-2xl p-2 mt-2">
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by rule name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#19191a] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {(["all", "allowed", "blocked"] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-all duration-200 ${
                statusFilter === status
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              {status}
            </button>
          ))}
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="ml-2 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10 cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-[#101012] border border-white/5 rounded-2xl overflow-hidden flex flex-col relative">
        {/* Loader overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <RefreshCw className="animate-spin text-primary" size={24} />
          </div>
        )}

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Identifier
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Rule
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Requests
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-white/50 uppercase tracking-wider text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {logs.length > 0
                ? logs.map((log) => (
                    <tr
                      key={log.id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="text-sm font-mono text-white/60 group-hover:text-white/80 transition-colors">
                          {formatDate(log.createdAt)}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="text-sm text-white/80 font-medium">
                          {log.identifier}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 font-mono">
                          {log.rule}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="text-sm text-white/60">
                          {log.count}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap text-right">
                        {log.allowed ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                            <CheckCircle2 size={12} />
                            Allowed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                            <XCircle size={12} />
                            Blocked
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td colSpan={5} className="py-32 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                            <Activity className="text-white/30" size={24} />
                          </div>
                          <h3 className="text-sm font-medium text-white/70">
                            No logs found
                          </h3>
                          <p className="text-xs text-white/40">
                            Try adjusting your filters or search query.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {logs.length > 0 && (
          <div className="border-t border-white/5 p-4 flex items-center justify-between bg-white/[0.01]">
            <p className="text-xs text-white/40 font-medium">
              Showing{" "}
              <span className="text-white/80">{(page - 1) * limit + 1}</span> to{" "}
              <span className="text-white/80">
                {Math.min(page * limit, totalLogs)}
              </span>{" "}
              of <span className="text-white/80">{totalLogs}</span> entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-white/50 font-medium px-2">
                Page {page} of {totalPages || 1}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsPage;
