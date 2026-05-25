"use client";
import { useState } from 'react';
import { X, Layout, Globe, Server, ChevronDown, Check, Loader2 } from 'lucide-react';
import axiosClient from '@/services/axios';

const BACKEND_FRAMEWORKS = [
    { id: 'nodejs', name: 'Node.js (Express/Nest)', icon: <Server size={16} /> },
    // { id: 'python', name: 'Python (FastAPI/Flask)', icon: <Terminal size={16} /> },
    // { id: 'go', name: 'Go', icon: <Cpu size={16} /> },
    // { id: 'ruby', name: 'Ruby on Rails', icon: <Code size={16} /> },
    // { id: 'java', name: 'Java (Spring Boot)', icon: <Layers size={16} /> },
    // { id: 'php', name: 'PHP (Laravel)', icon: <Box size={16} /> },
];

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
}

const CreateProjectModal = ({ isOpen, onClose, onCreated }: CreateProjectModalProps) => {
    const [projectName, setProjectName] = useState('');
    const [framework, setFramework] = useState('nodejs');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [environment, setEnvironment] = useState('production');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<{ id: string; name: string; apiKey: string } | null>(null);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axiosClient.post('/tenant/api-key', { name: projectName.trim() });
            const generatedKey = res.data.apiKey;
            const newProjectId = res.data.apiKeyId; // Now using the real UUID from the backend!

            setSuccessData({
                id: newProjectId,
                name: projectName.trim(),
                apiKey: generatedKey
            });
            onCreated(); // Refresh the project list in the background
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to create project. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (successData) {
            navigator.clipboard.writeText(successData.apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleFinish = () => {
        if (successData) {
            onClose();
            // Redirect to project overview with name in URL for the TopBar to extract
            window.location.href = `/dashboard/project/${successData.id}?name=${encodeURIComponent(successData.name)}`;
        }
    };

    // If success, render the success state
    if (successData) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div
                    className="w-full max-w-md bg-[#101012] border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                            <Check size={24} className="text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Project Created!</h2>
                        <p className="text-sm text-white/50 mt-1">
                            {successData.name} is ready to go.
                        </p>
                    </div>

                    <div className="bg-[#ea580c]/10 border border-[#ea580c]/20 rounded-lg p-4 mb-5">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-[#ea580c]">
                                <Globe size={16} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-sm font-semibold text-[#ea580c] mb-1">
                                    Save your API Key
                                </h4>
                                <p className="text-[12px] text-[#ea580c]/80 leading-relaxed">
                                    Please copy this key now. For security reasons, we will <strong>never show it to you again</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mb-8">
                        <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
                            Secret API Key
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-[#19191a] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white/90 overflow-x-auto whitespace-nowrap">
                                {successData.apiKey}
                            </div>
                            <button
                                onClick={handleCopy}
                                className="h-11 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors shrink-0 hover:cursor-pointer"
                            >
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleFinish}
                        className="w-full bg-white hover:bg-white/90 text-black px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer"
                    >
                        Go to Project Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            {/* Modal Container */}
            <div
                className="w-full max-w-md bg-[#101012] border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white tracking-tight">Create New Project</h2>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors hover:cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreate} className="space-y-5">
                    {/* Project Name */}
                    <div className="space-y-2">
                        <label htmlFor="projectName" className="text-sm font-medium text-white/80">
                            Project Name
                        </label>
                        <input
                            id="projectName"
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="e.g. My Awesome App"
                            className="w-full bg-[#19191a] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                            required
                        />
                    </div>

                    {/* Framework Selection */}
                    <div className="space-y-2 relative">
                        <label className="text-sm font-medium text-white/80">
                            Backend Framework
                        </label>
                        <div
                            className={`w-full flex items-center justify-between bg-[#19191a] border ${isDropdownOpen ? 'border-primary/50 ring-1 ring-primary/50' : 'border-white/10 hover:border-white/20'} rounded-lg px-4 py-2.5 cursor-pointer transition-all`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-primary/70">
                                    {BACKEND_FRAMEWORKS.find(f => f.id === framework)?.icon}
                                </span>
                                <span className="text-sm text-white">
                                    {BACKEND_FRAMEWORKS.find(f => f.id === framework)?.name}
                                </span>
                            </div>
                            <ChevronDown size={16} className={`text-white/50 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-[75px] left-0 w-full bg-[#19191a] border border-white/10 rounded-lg shadow-xl shadow-black/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="max-h-52 overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {BACKEND_FRAMEWORKS.map((fw) => (
                                        <div
                                            key={fw.id}
                                            onClick={() => {
                                                setFramework(fw.id);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${framework === fw.id
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`${framework === fw.id ? 'text-primary' : 'text-white/40'}`}>
                                                    {fw.icon}
                                                </span>
                                                <span className="text-sm font-medium">{fw.name}</span>
                                            </div>
                                            {framework === fw.id && <Check size={16} className="text-primary" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Environment Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">
                            Environment Setup
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setEnvironment('production')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition-all ${environment === 'production'
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-[#19191a] border-white/10 text-white/50 hover:border-white/20'
                                    }`}
                            >
                                <Globe size={16} />
                                Production
                            </button>
                            <button
                                type="button"
                                onClick={() => setEnvironment('development')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition-all ${environment === 'development'
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-[#19191a] border-white/10 text-white/50 hover:border-white/20'
                                    }`}
                            >
                                <Layout size={16} />
                                Development
                            </button>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <p className="text-[12px] text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#f97316] disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 cursor-pointer"
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />}
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
