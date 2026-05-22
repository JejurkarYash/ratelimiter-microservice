"use client";
import React, { useEffect, useState } from "react";
import { User, Mail, CreditCard, Calendar, RefreshCw } from "lucide-react";
import axiosClient from "@/services/axios";
import { formatRelativeTime } from "@/lib/time";
import { useSession } from "next-auth/react";

interface TenantInfo {
    id: string;
    name: string;
    email: string;
    plan: string;
    createdAt: string;
}

const SettingsPage = () => {
    const { data: session } = useSession();
    const [tenant, setTenant] = useState<TenantInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTenantInfo = async () => {
            try {
                const res = await axiosClient.get("/tenant/me");
                setTenant(res.data.tenantInfo);
            } catch (err) {
                console.error("Failed to fetch tenant info:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTenantInfo();
    }, []);

    const getInitials = (name: string) => name?.charAt(0).toUpperCase() ?? "U";

    return (
        <div className="max-w-5xl ws-full flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">Account</p>
                    <h1 className="text-[18px] font-semibold text-white/90 tracking-tight leading-none">Settings</h1>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 bg-[#19191a] border border-white/[0.06] rounded-xl">
                    <RefreshCw className="animate-spin text-white/25" size={14} />
                </div>
            ) : tenant ? (
                <div className="flex flex-col gap-3">
                    {/* Profile row */}
                    <div className="bg-[#19191a] border border-white/[0.06] rounded-xl p-5 flex items-center gap-5">
                        {/* Avatar */}
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt="Profile"
                                className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-white/10"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-lg font-bold text-primary/80 font-mono">
                                {getInitials(tenant.name)}
                            </div>
                        )}
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <h2 className="text-[14px] font-semibold text-white/85 tracking-wide">{tenant.name}</h2>
                            <p className="text-[11px] font-mono text-white/40 truncate">{tenant.email}</p>
                        </div>
                    </div>

                    {/* Divider section: info rows */}
                    <div className="bg-[#19191a] border border-white/[0.06] rounded-xl divide-y divide-white/[0.05]">
                        <div className="flex items-center justify-between px-5 py-3.5">
                            <div className="flex items-center gap-2.5 text-[11px] font-mono text-white/40">
                                <Mail size={12} className="text-white/20" /> email
                            </div>
                            <span className="text-[11px] font-mono text-white/65">{tenant.email}</span>
                        </div>
                        <div className="flex items-center justify-between px-5 py-3.5">
                            <div className="flex items-center gap-2.5 text-[11px] font-mono text-white/40">
                                <CreditCard size={12} className="text-white/20" /> plan
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/[0.07] border border-emerald-500/[0.15] text-emerald-400/70 text-[10px] font-mono capitalize">
                                {tenant.plan}
                            </span>
                        </div>
                        <div className="flex items-center justify-between px-5 py-3.5">
                            <div className="flex items-center gap-2.5 text-[11px] font-mono text-white/40">
                                <Calendar size={12} className="text-white/20" /> joined
                            </div>
                            <span className="text-[11px] font-mono text-white/40">{formatRelativeTime(tenant.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between px-5 py-3.5">
                            <div className="flex items-center gap-2.5 text-[11px] font-mono text-white/40">
                                <User size={12} className="text-white/20" /> account id
                            </div>
                            <span className="text-[10px] font-mono text-white/25 select-all">{tenant.id}</span>
                        </div>
                    </div>

                    {/* Billing notice */}
                    <div className="bg-[#101012] border border-white/[0.06] rounded-xl px-4 py-3">
                        <p className="text-[11px] font-mono text-white/25 leading-relaxed">
                            Billing management and plan upgrades are coming soon.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center py-16 bg-[#19191a] border border-white/[0.06] rounded-xl">
                    <p className="text-[11px] font-mono text-white/25">failed to load profile</p>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;