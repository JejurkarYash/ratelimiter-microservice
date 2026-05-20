"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Key,
    Shield,
    CheckCircle,
    XCircle,
    RefreshCw,
    AlertTriangle
} from "lucide-react";
import axiosClient from "@/services/axios";
import { formatRelativeTime } from "@/lib/time";

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
                console.log(res.data)
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

        if (projectId) {
            fetchKeyData();
        }
    }, [projectId]);

    return (
        <div className="max-w-3xl w-full flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                        API Key Settings
                    </h1>
                    <p className="text-sm text-white/50">
                        View the active API key metadata for your project. Key generation and deletion are managed in project settings.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20 bg-[#101012] border border-white/[0.05] rounded-2xl">
                    <RefreshCw className="animate-spin text-white/40" size={20} />
                </div>
            ) : apiKey ? (
                <div className="flex flex-col gap-4">
                    <div className="relative bg-[#19191a] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-5 overflow-hidden">
                        {/* Ambient glow */}
                        <div className="absolute top-0 right-0 w-56 h-56 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                        {/* Key meta */}
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Key size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white/90 tracking-wide">{apiKey.name}</h3>
                                    {apiKey.isActive ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 mt-0.5">
                                            <CheckCircle size={10} /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-500 mt-0.5">
                                            <XCircle size={10} /> Inactive
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/[0.05]" />

                        {/* Key value */}
                        <div className="flex flex-col gap-2 relative z-10">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                Secret Key Reference
                            </label>
                            <div className="bg-[#101012] border border-white/[0.06] rounded-lg px-4 py-3 flex items-center min-w-0 shadow-inner">
                                <code className="text-[13px] font-mono text-primary/80 truncate opacity-80 select-none">
                                    {apiKey.apiKeyMasked}
                                </code>
                            </div>
                        </div>

                        {/* Footer meta */}
                        {/* <div className="flex items-center gap-6 text-xs text-white/40 mt-2">
                        <span className="flex items-center gap-1.5 font-mono">
                            <Shield size={12} className="text-white/20" /> Created {apiKey.createdAt}
                        </span>
                    </div> */}
                    </div>

                    {/* Warning Notice */}
                    <div className="bg-[#101012] border border-white/5 rounded-xl px-5 py-4 flex items-start gap-3">
                        <AlertTriangle size={16} className="text-red-400/80 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-white/40 leading-relaxed">
                            Your project supports <span className="text-white/70 font-medium">one API key</span> at a time.
                            If you delete this API key in project settings, <span className="text-red-400/80 font-medium">you will lose all rate limit rules and usage logs</span> associated with it.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 bg-[#101012] border border-dashed border-white/10 rounded-2xl py-20 px-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <XCircle size={24} className="text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-white/80 mb-1">Project Not Found</h2>
                        <p className="text-sm text-white/50 max-w-sm">
                            Could not load the API key metadata for this project.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeys;
