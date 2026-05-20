"use client";
import React, { useState } from "react";
import {
    Copy,
    Eye,
    EyeOff,
    Key,
    Clock,
    Shield,
    CheckCircle,
    X,
    AlertTriangle,
    Plus,
    Trash2,
} from "lucide-react";

// null = no key exists yet
const INITIAL_KEY = {
    name: "Production Key",
    key: "sk_live_593kf92jd84nf92ma94nf82mQ9fX3za",
    createdAt: "Apr 10, 2026",
    lastUsed: "2 min ago",
};

// ------------------------------------------------------------------
// Revoke confirmation modal
// ------------------------------------------------------------------
const RevokeModal = ({
    isOpen,
    onClose,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
                className="w-full max-w-sm bg-[#101012] border border-white/10 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={22} className="text-red-400" />
                </div>

                <h2 className="text-lg font-bold text-white text-center mb-2">
                    Revoke API Key?
                </h2>
                <p className="text-sm text-white/50 text-center mb-6 leading-relaxed">
                    This will <span className="text-white/80 font-medium">permanently delete</span> your current key.
                    Any services using it will lose access immediately.
                    You can generate a new key afterwards.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all cursor-pointer"
                    >
                        Yes, Revoke
                    </button>
                </div>
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// Generate key modal
// ------------------------------------------------------------------
const GenerateKeyModal = ({
    isOpen,
    onClose,
    onGenerate,
}: {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (name: string) => void;
}) => {
    const [name, setName] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(name.trim() || "Production Key");
        setName("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
                className="w-full max-w-md bg-[#101012] border border-white/10 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        Generate API Key
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="keyName" className="text-sm font-medium text-white/80">
                            Key Name
                        </label>
                        <input
                            id="keyName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Production Key"
                            className="w-full bg-[#19191a] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                            required
                        />
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 flex items-start gap-3">
                        <Shield size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-white/60 leading-relaxed">
                            The key will be shown <span className="text-white/90 font-medium">only once</span>.
                            Copy and store it in a secure place before leaving this page.
                        </p>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#ea580c] hover:bg-[#f97316] text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center gap-2"
                        >
                            <Key size={15} />
                            Generate Key
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// Main component
// ------------------------------------------------------------------
const ApiKeys = () => {
    const [apiKey, setApiKey] = useState<typeof INITIAL_KEY | null>(INITIAL_KEY);
    const [visible, setVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);

    const masked = `sk_live_${"•".repeat(24)}`;

    const handleCopy = () => {
        if (!apiKey) return;
        navigator.clipboard.writeText(apiKey.key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRevoke = () => {
        setApiKey(null);
        setVisible(false);
        setShowRevokeModal(false);
    };

    const handleGenerate = (name: string) => {
        // Simulate key generation
        setApiKey({
            name,
            key: "sk_live_" + Math.random().toString(36).slice(2, 34),
            createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            lastUsed: "Just now",
        });
        setVisible(true); // reveal automatically on creation so user can copy
    };

    return (
        <div className="max-w-3xl w-full flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                        API Key
                    </h1>
                    <p className="text-sm text-white/50">
                        Your project supports one active API key at a time.
                        Revoke the current key to generate a new one.
                    </p>
                </div>
            </div>

            {/* ── Key exists ── */}
            {apiKey ? (
                <div className="flex flex-col gap-4">
                    {/* Key card */}
                    <div className="relative bg-[#19191a] border border-white/5 rounded-2xl p-6 flex flex-col gap-5 overflow-hidden">
                        {/* Ambient glow */}
                        <div className="absolute top-0 right-0 w-56 h-56 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                        {/* Key meta */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Key size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white/90">{apiKey.name}</h3>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 mt-0.5">
                                        <CheckCircle size={10} /> Active
                                    </span>
                                </div>
                            </div>

                            {/* Revoke */}
                            <button
                                onClick={() => setShowRevokeModal(true)}
                                className="flex items-center gap-2 text-sm text-red-400/70 hover:text-red-400 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/5 px-3 py-2 rounded-lg transition-all cursor-pointer"
                            >
                                <Trash2 size={15} />
                                Revoke
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/[0.05]" />

                        {/* Key value */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-white/50 uppercase tracking-widest">
                                Secret Key
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-black/30 border border-white/8 rounded-lg px-4 py-3 flex items-center justify-between gap-3 min-w-0">
                                    <code className="text-[13px] font-mono text-primary/80 truncate select-all">
                                        {visible ? apiKey.key : masked}
                                    </code>
                                    <button
                                        onClick={() => setVisible(!visible)}
                                        className="text-white/40 hover:text-white/80 transition-colors flex-shrink-0"
                                    >
                                        {visible ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>

                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all flex-shrink-0 cursor-pointer ${
                                        copied
                                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                            : "bg-[#101012] border-white/10 hover:border-white/20 text-white/70 hover:text-white"
                                    }`}
                                >
                                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                        </div>

                        {/* Footer meta */}
                        <div className="flex items-center gap-6 text-xs text-white/40">
                            <span className="flex items-center gap-1.5">
                                <Shield size={12} /> Created {apiKey.createdAt}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={12} /> Last used {apiKey.lastUsed}
                            </span>
                        </div>
                    </div>

                    {/* One-key notice */}
                    <div className="bg-[#101012] border border-white/5 rounded-xl px-5 py-4 flex items-start gap-3">
                        <AlertTriangle size={16} className="text-white/30 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-white/40 leading-relaxed">
                            Your project supports <span className="text-white/70 font-medium">one API key</span> at a time.
                            To generate a new key you must revoke the existing one first.
                            This will break any integrations using the current key.
                        </p>
                    </div>
                </div>
            ) : (
                /* ── No key ── */
                <div className="flex flex-col items-center justify-center gap-6 bg-[#101012] border border-dashed border-white/10 rounded-2xl py-20 px-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Key size={28} className="text-white/30" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white/80 mb-2">No API Key</h2>
                        <p className="text-sm text-white/50 max-w-sm">
                            You don't have an active API key yet. Generate one to start
                            using the rate limiter SDK in your project.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowGenerateModal(true)}
                        className="bg-[#ea580c] hover:bg-[#f97316] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Generate API Key
                    </button>
                </div>
            )}

            {/* Modals */}
            <RevokeModal
                isOpen={showRevokeModal}
                onClose={() => setShowRevokeModal(false)}
                onConfirm={handleRevoke}
            />
            <GenerateKeyModal
                isOpen={showGenerateModal}
                onClose={() => setShowGenerateModal(false)}
                onGenerate={handleGenerate}
            />
        </div>
    );
};

export default ApiKeys;
