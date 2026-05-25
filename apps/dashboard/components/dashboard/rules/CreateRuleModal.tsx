"use client";
import React, { useState } from 'react';
import { X, Clock, Shield, ChevronDown, Cpu } from 'lucide-react';
import axiosClient from '@/services/axios';
import { useParams } from 'next/navigation';
import { convertToSeconds } from '@/lib/time';

interface CreateRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateRuleModal = ({ isOpen, onClose }: CreateRuleModalProps) => {
    const [ruleName, setRuleName] = useState('');
    const [limit, setLimit] = useState(10);
    const [timeWindow, setTimeWindow] = useState('second');
    const [algorithm, setAlgorithm] = useState<'FIXED_WINDOW' | 'SLIDING_WINDOW'>('FIXED_WINDOW');
    const [algoOpen, setAlgoOpen] = useState(false);

    const params = useParams();
    const apiKeyId = params.id;

    if (!isOpen) return null;

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post("/rules/create-rule", {
                name: ruleName,
                limit,
                window: convertToSeconds(timeWindow as "second" | "minute" | "hour"),
                algorithm,
                apiKeyId
            });
            onClose();
        } catch (error: any) {
            console.error("Error creating rule:", error.response?.data || error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
                className="w-full max-w-md bg-[#101012] border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white tracking-tight">Create New Rule</h2>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreate} className="space-y-5">
                    {/* Rule Name */}
                    <div className="space-y-2">
                        <label htmlFor="ruleName" className="text-sm font-medium text-white/80">
                            Unique Rule Name
                        </label>
                        <input
                            id="ruleName"
                            type="text"
                            value={ruleName}
                            onChange={(e) => setRuleName(e.target.value)}
                            placeholder="e.g. Auth Login Limit"
                            className="w-full bg-[#19191a] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                            required
                        />
                    </div>


                    {/* Rate Limit Configuration */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">
                            Rate Limit Configuration
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                <input
                                    type="number"
                                    min="1"
                                    value={limit}
                                    onChange={(e) => setLimit(parseInt(e.target.value) || 0)}
                                    className="w-full bg-[#19191a] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                                    required
                                />
                            </div>
                            <span className="text-white/50 text-sm">requests per</span>
                            <div className="flex-1 relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                <select
                                    value={timeWindow}
                                    onChange={(e) => setTimeWindow(e.target.value)}
                                    className="w-full bg-[#19191a] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm appearance-none cursor-pointer"
                                >
                                    <option value="second">Second</option>
                                    <option value="minute">Minute</option>
                                    <option value="hour">Hour</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Algorithm */}
                    <div className="space-y-2 relative">
                        <label className="text-sm font-medium text-white/80">Algorithm</label>
                        <button
                            type="button"
                            onClick={() => setAlgoOpen(!algoOpen)}
                            className={`w-full flex items-center justify-between bg-[#19191a] border ${algoOpen ? 'border-primary/50 ring-1 ring-primary/50' : 'border-white/10 hover:border-white/20'
                                } rounded-lg px-4 py-2.5 cursor-pointer transition-all`}
                        >
                            <div className="flex items-center gap-2">
                                <Cpu size={15} className="text-white/40 shrink-0" />
                                <span className="text-sm text-white">
                                    {algorithm === 'FIXED_WINDOW' ? 'Fixed Window' : 'Sliding Window'}
                                </span>
                            </div>
                            <ChevronDown size={15} className={`text-white/40 transition-transform duration-200 ${algoOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {algoOpen && (
                            <div className="absolute top-[calc(100%-2px)] left-0 w-full bg-[#19191a] border border-white/10 rounded-lg shadow-xl shadow-black/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                {(['FIXED_WINDOW', 'SLIDING_WINDOW'] as const).map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => { setAlgorithm(val); setAlgoOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${algorithm === val ? 'bg-primary/10' : 'hover:bg-white/[0.03]'
                                            }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full border shrink-0 flex items-center justify-center ${algorithm === val ? 'border-primary bg-primary/80' : 'border-white/20'
                                            }`}>
                                            {algorithm === val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${algorithm === val ? 'text-primary' : 'text-white/80'}`}>
                                                {val === 'FIXED_WINDOW' ? 'Fixed Window' : 'Sliding Window'}
                                            </p>
                                            <code className={`text-[10px] font-mono ${algorithm === val ? 'text-primary/60' : 'text-white/25'}`}>
                                                {val}
                                            </code>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#ea580c] hover:bg-[#f97316] text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 cursor-pointer"
                        >
                            Create Rule
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRuleModal;
