"use client";
import React, { useEffect, useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import RuleCard from "./RuleCard";
import CreateRuleModal from "./CreateRuleModal";
import UpdateRuleModal from "./UpdateRuleModal";
import axiosClient from "@/services/axios";

interface Rule {
    id: string;
    name: string;
    limit: number;
    window: number;
    algorithm: "FIXED_WINDOW" | "SLIDING_WINDOW";
}

const RulesList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [rules, setRules] = useState([]);

    const fetchRules = async () => {
        const response = await axiosClient.get("/rules/get-rules")
        setRules(response.data);
        console.log(response.data)
    }

    useEffect(() => {
        fetchRules();
    }, [])

    const handleDelete = async (ruleId: string) => {
        try {
            await axiosClient.delete(`/rules/rule/${ruleId}`);
            console.log("Rule deleted successfully", ruleId);
            setRules(rules.filter((rule: Rule) => rule.id !== ruleId));
        } catch (error: any) {
            console.error("Error deleting rule:", error.response.data);
        }
    };

    const handleCreateModalClose = () => {
        setIsModalOpen(false);
        fetchRules();
    }

    const handleEdit = (ruleId: string) => {
        const ruleToEdit = rules.find((r: Rule) => r.id === ruleId);
        if (ruleToEdit) {
            setEditingRule(ruleToEdit as Rule);
        }
    }

    const handleEditModalClose = () => {
        setEditingRule(null);
        fetchRules();
    }

    return (
        <div className="max-w-5xl w-full flex flex-col gap-5">
            {/* ── Page Header ── */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">
                        Project
                    </p>
                    <h1 className="text-[18px] font-semibold text-white/90 tracking-tight leading-none">
                        Rate Limit Rules
                    </h1>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1.5 bg-primary/90 hover:bg-primary text-white px-3 py-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer shrink-0"
                >
                    <Plus size={12} />
                    New Rule
                </button>
            </div>



            {/* ── Toolbar ── */}
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Search
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/25"
                        size={12}
                    />
                    <input
                        type="text"
                        placeholder="Search rules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#101012] border border-white/[0.07] h-8 text-[11px] rounded-lg pl-8 pr-3 text-white/80 placeholder-white/25 focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.08] transition-all font-mono w-56"
                    />
                </div>

            </div>


            {/* ── Rules Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rules
                    .filter((rule: Rule) => rule.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((rule: Rule) => (
                        <RuleCard
                            key={rule.id}
                            id={rule.id}
                            name={rule.name}
                            limit={rule.limit}
                            window={rule.window}
                            algorithm={rule.algorithm}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))}
            </div>

            {/* Modals */}
            <CreateRuleModal
                isOpen={isModalOpen}
                onClose={handleCreateModalClose}
            />
            <UpdateRuleModal
                isOpen={!!editingRule}
                onClose={handleEditModalClose}
                rule={editingRule}
            />
        </div>
    );
};

export default RulesList;