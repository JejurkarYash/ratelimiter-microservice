"use client";
import React, { useState } from "react";
import { Shield, Copy, CheckCheck, Trash2, Clock, Cpu, Edit2 } from "lucide-react";

interface RuleCardProps {
    id: string;
    name: string;
    limit: number;
    window: number; // in seconds
    algorithm: "FIXED_WINDOW" | "SLIDING_WINDOW";
    createdAt?: string;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
}

/** Converts seconds to a human-readable string: 60 → "1m", 3600 → "1h", etc. */
function formatWindow(seconds: number): string {
    if (seconds >= 86400 && seconds % 86400 === 0) return `${seconds / 86400}d`;
    if (seconds >= 3600 && seconds % 3600 === 0) return `${seconds / 3600}h`;
    if (seconds >= 60 && seconds % 60 === 0) return `${seconds / 60}m`;
    return `${seconds}s`;
}

const RuleCard = ({ id, name, limit, window: windowSec, algorithm, createdAt, onDelete, onEdit }: RuleCardProps) => {
    const [copied, setCopied] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(name);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirmDelete) {
            onDelete?.(id);
            setConfirmDelete(false);
        } else {
            setConfirmDelete(true);
            // auto-reset confirm after 3s if user doesn't click again
            setTimeout(() => setConfirmDelete(false), 3000);
        }
    };

    const isFixed = algorithm === "FIXED_WINDOW";

    return (
        <div className="group relative flex flex-col justify-between rounded-xl border border-white/[0.06] bg-[#19191a] hover:border-white/[0.12] transition-all duration-300 p-4 w-full overflow-hidden">
            {/* Top-edge accent on hover */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Shield size={16} className="text-primary/70" />
                    </div>
                    <h3 className="text-[14px] font-semibold text-white/85 tracking-wide leading-tight font-mono truncate">
                        {name}
                    </h3>
                </div>

                {/* Copy rule name — critical for SDK usage */}
                <button
                    onClick={handleCopy}
                    title="Copy rule name for SDK"
                    className="flex items-center gap-1 text-white/20 hover:text-white/70 transition-colors p-0.5 shrink-0 cursor-pointer"
                >
                    {copied
                        ? <CheckCheck size={13} className="text-emerald-400" />
                        : <Copy size={13} />
                    }
                </button>
            </div>

            {/* ── Divider ── */}
            <div className="w-full h-px bg-white/[0.05] my-3" />

            {/* ── Stats ── */}
            <div className="flex items-center gap-2 flex-wrap">
                {/* Rate */}
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] text-[9.5px] text-white/50 font-mono">
                    <Clock size={8} className="text-white/25" />
                    {limit} req / {formatWindow(windowSec)}
                </span>

                {/* Algorithm */}
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9.5px] font-mono ${isFixed
                    ? "bg-blue-500/[0.07] border-blue-500/[0.15] text-blue-400/60"
                    : "bg-violet-500/[0.07] border-violet-500/[0.15] text-violet-400/60"
                    }`}>
                    <Cpu size={8} />
                    {isFixed ? "Fixed Window" : "Sliding Window"}
                </span>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between mt-3">
                {/* Created date */}
                {createdAt && (
                    <span className="text-[9.5px] text-white/20 font-mono">
                        {new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                )}

                {/* Delete — two-tap confirm pattern */}
                <button
                    onClick={handleDelete}
                    title={confirmDelete ? "Click again to confirm" : "Delete rule"}
                    className={`flex items-center gap-1 text-[10px] font-mono transition-all duration-200 cursor-pointer ml-auto px-2 py-0.5 rounded-md ${confirmDelete
                        ? "bg-red-500/10 border border-red-500/30 text-red-400"
                        : "text-white/20 hover:text-red-400/70 border border-transparent"
                        }`}
                >
                    <Trash2 size={11} />
                    {confirmDelete ? "confirm ?" : ""}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit?.(id); }}
                    title="Edit rule"
                    className="flex items-center gap-1 text-[10px] font-mono transition-all duration-200 cursor-pointer text-white/20 hover:text-primary/80 border border-transparent px-2 py-0.5 rounded-md"
                >
                    <Edit2 size={11} />
                </button>
            </div>
        </div>
    );
};

export default RuleCard;