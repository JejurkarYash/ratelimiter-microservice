"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, AlertTriangle, X } from "lucide-react";
import axiosClient from "@/services/axios";

const SettingsPage = () => {
    const params = useParams();
    const router = useRouter();
    const projectId = params?.id as string;

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [error, setError] = useState("");

    const handleDeleteProject = async () => {
        if (deleteConfirmation !== "DELETE") {
            setError('Type "DELETE" to confirm');
            return;
        }
        setIsDeleting(true);
        try {
            await axiosClient.delete(`/tenant/keys/${projectId}`);
            setIsDeleteDialogOpen(false);
            setTimeout(() => router.push("/dashboard"), 500);
        } catch (err: any) {
            console.error("Error deleting project:", err);
            setError(err.response?.data?.message || "Failed to delete project. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const closeDialog = () => {
        setIsDeleteDialogOpen(false);
        setDeleteConfirmation("");
        setError("");
    };

    return (
        <div className="max-w-5xl w-full flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">Project</p>
                    <h1 className="text-[18px] font-semibold text-white/90 tracking-tight leading-none">Settings</h1>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#19191a] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center gap-2">
                    <AlertTriangle size={12} className="text-red-400/60" />
                    <p className="text-[10px] font-mono uppercase tracking-widest text-red-400/50">Danger Zone</p>
                </div>
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-semibold text-white/75 mb-1">Delete Project</p>
                        <p className="text-[11px] font-mono text-white/30 leading-relaxed max-w-md">
                            Permanently deletes this project including all API keys, rate limit rules, and usage logs. This action cannot be undone.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/[0.07] border border-red-500/[0.15] text-red-400/70 text-[11px] font-mono transition-all hover:bg-red-500/[0.12] hover:border-red-500/25 cursor-pointer shrink-0"
                    >
                        <Trash2 size={11} />
                        delete
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {isDeleteDialogOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0f0f10] border border-white/[0.08] rounded-xl max-w-sm w-full">
                        {/* Dialog header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <AlertTriangle size={13} className="text-red-400/80" />
                                </div>
                                <h2 className="text-[13px] font-semibold text-white/85">Confirm Deletion</h2>
                            </div>
                            <button
                                onClick={closeDialog}
                                disabled={isDeleting}
                                className="p-1 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-colors cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Dialog body */}
                        <div className="px-5 py-4 flex flex-col gap-4">
                            <div className="bg-red-500/[0.05] border border-red-500/[0.12] rounded-lg p-3.5">
                                <p className="text-[11px] font-mono text-white/50 leading-relaxed mb-2">
                                    This will permanently delete:
                                </p>
                                <ul className="text-[11px] font-mono text-red-400/60 space-y-0.5 ml-2">
                                    <li>• API key</li>
                                    <li>• All rate limiting rules</li>
                                    <li>• All usage logs</li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-mono text-white/35 uppercase tracking-widest">
                                    Type <span className="text-red-400/60">DELETE</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmation}
                                    onChange={(e) => { setDeleteConfirmation(e.target.value); setError(""); }}
                                    placeholder="DELETE"
                                    disabled={isDeleting}
                                    className="bg-[#0a0a0b] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] font-mono text-white/80 placeholder:text-white/20 focus:outline-none focus:border-red-500/40 transition-all disabled:opacity-50"
                                />
                            </div>
                            {error && (
                                <p className="text-[10px] font-mono text-red-400/70">{error}</p>
                            )}
                        </div>

                        {/* Dialog footer */}
                        <div className="flex gap-2.5 px-5 pb-5">
                            <button
                                onClick={closeDialog}
                                disabled={isDeleting}
                                className="flex-1 py-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.04] text-[12px] font-mono transition-all disabled:opacity-50 cursor-pointer"
                            >
                                cancel
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                disabled={isDeleting || deleteConfirmation !== "DELETE"}
                                className="flex-1 py-2 rounded-lg bg-red-500/[0.08] border border-red-500/[0.15] text-red-400/70 hover:bg-red-500/[0.14] text-[12px] font-mono transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isDeleting ? "deleting..." : "delete project"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
