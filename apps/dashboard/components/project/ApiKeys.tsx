"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Key, CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import axiosClient from "@/services/axios";

interface ApiKeyData {
    id: string;
    name: string;
    apiKeyMasked: string;
    isActive: boolean;
}

const ApiKeys = () => {
    const params = useParams();
    const projectId = params?.id;
    const [apiKey, setApiKey] = useState<ApiKeyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKeyData = async () => {
            try {
                const res = await axiosClient.get(`/tenant/projects/${projectId}/overview`);
                setApiKey({
                    id: res.data.project.id,
                    name: res.data.project.name,
                    apiKeyMasked: res.data.project.apiKeyMasked,
                    isActive: res.data.project.isActive,
                });
            } catch (err) {
                console.error("Failed to fetch API key metadata:", err);
            } finally {
                setLoading(false);
            }
        };
        if (projectId) fetchKeyData();
    }, [projectId]);

    return (
        <div className="max-w-5xl w-full flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">Project</p>
                    <h1 className="text-[18px] font-semibold text-white/90 tracking-tight leading-none">API Key</h1>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 bg-[#19191a] border border-white/[0.06] rounded-xl">
                    <RefreshCw className="animate-spin text-white/25" size={14} />
                </div>
            ) : apiKey ? (
                <div className="flex flex-col gap-3">
                    {/* Key Card */}
                    <div className="bg-[#19191a] border border-white/[0.06] rounded-xl p-5 flex flex-col gap-4">
                        {/* Name + Status */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Key size={14} className="text-primary/70" />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-semibold text-white/85 tracking-wide font-mono">{apiKey.name}</h3>
                                    {apiKey.isActive ? (
                                        <span className="inline-flex items-center gap-1 text-[9.5px] font-mono text-emerald-400/80 mt-0.5">
                                            <CheckCircle size={9} /> active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[9.5px] font-mono text-red-400/80 mt-0.5">
                                            <XCircle size={9} /> inactive
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/[0.05]" />

                        {/* Masked Key */}
                        <div className="flex flex-col gap-1.5">
                            <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Secret Key Reference</p>
                            <div className="bg-[#101012] border border-white/[0.06] rounded-lg px-4 py-2.5">
                                <code className="text-[12px] font-mono text-primary/70 select-none">{apiKey.apiKeyMasked}</code>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-[#101012] border border-white/[0.06] rounded-xl px-4 py-3 flex items-start gap-2.5">
                        <AlertTriangle size={13} className="text-red-400/60 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] font-mono text-white/35 leading-relaxed">
                            One API key per project.{" "}
                            <span className="text-red-400/60">Deleting it will remove all rules and logs.</span>{" "}
                            Manage deletion in project settings.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-16 bg-[#19191a] border border-white/[0.06] rounded-xl text-center">
                    <XCircle size={16} className="text-red-400/50" />
                    <p className="text-[11px] font-mono text-white/30">could not load api key metadata</p>
                </div>
            )}
        </div>
    );
};

export default ApiKeys;
