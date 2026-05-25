"use client";
import { useEffect, useState } from "react";
import { Search, Plus, FolderOpen } from "lucide-react";
import ProjectCard from "../project/ProjectCard";
import CreateProjectModal from "../project/CreateProjectModal";
import axiosClient from "@/services/axios";
import { Project } from "@/types/project";

const ProjectLists = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchProjects = async () => {
        try {
            const res = await axiosClient.get("/tenant/projects");
            setProjects(res.data);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filtered = projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-5xl w-full flex flex-col gap-5">
            {/* ── Page Header ── */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">
                        Dashboard
                    </p>
                    <h1 className="text-[18px] font-semibold text-white/90 tracking-tight leading-none">
                        Projects
                    </h1>
                </div>

                {
                    projects.length >= 1 && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-1.5 bg-primary/90 hover:bg-primary text-white px-3 py-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer shrink-0"
                        >
                            <Plus size={12} />
                            New Project
                        </button>
                    )
                }

            </div>

            {/* ── Toolbar ── */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/25"
                        size={12}
                    />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-[#101012] border border-white/[0.07] h-8 text-[11px] rounded-lg pl-8 pr-3 text-white/80 placeholder-white/25 focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.08] transition-all font-mono w-56"
                    />
                </div>
            </div>

            {/* ── Project Cards ── */}
            {loading ? (
                // Skeleton loading state
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-white/[0.06] bg-project-card p-5 animate-pulse"
                        >
                            <div className="h-4 w-32 bg-white/[0.06] rounded mb-2" />
                            <div className="h-3 w-24 bg-white/[0.04] rounded mb-6" />
                            <div className="h-px bg-white/[0.05] my-4" />
                            <div className="grid grid-cols-3 gap-2">
                                {[...Array(3)].map((_, j) => (
                                    <div key={j}>
                                        <div className="h-3 w-14 bg-white/[0.04] rounded mb-2" />
                                        <div className="h-4 w-8 bg-white/[0.06] rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-12 h-12 rounded-xl border border-white/[0.07] bg-white/[0.02] flex items-center justify-center mb-4">
                        <FolderOpen size={22} className="text-white/20" />
                    </div>
                    <p className="text-sm font-medium text-white/50 mb-1">
                        {search ? "No projects match your search" : "No projects yet"}
                    </p>
                    <p className="text-[12px] text-white/25 mb-6">
                        {search ? "Try a different search term" : "Create your first project to get started"}
                    </p>
                    {!search && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-1.5 bg-primary/90 hover:bg-primary text-white px-4 py-2 rounded-lg text-[12px] font-medium transition-all cursor-pointer"
                        >
                            <Plus size={13} />
                            Create Project
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filtered.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={fetchProjects}
            />
        </div>
    );
};

export default ProjectLists;