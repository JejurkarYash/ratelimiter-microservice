import React from 'react';
import { Hammer, Sparkles } from 'lucide-react';

const UsagePage = () => {
    return (
        <div className="max-w-3xl w-full flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                        Usage Analytics
                    </h1>
                    <p className="text-sm text-white/50">
                        Monitor your rate limit rules, request volumes, and blocking patterns.
                    </p>
                </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="flex flex-col items-center justify-center gap-5 bg-[#101012] border border-dashed border-white/10 rounded-2xl py-24 px-8 text-center relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center relative z-10 border border-primary/20 shadow-lg shadow-primary/5">
                    <Hammer size={28} className="text-primary" />
                </div>

                <div className="relative z-10">
                    <h2 className="text-lg font-semibold text-white/90 mb-2 flex items-center justify-center gap-2">
                        Under Development <Sparkles size={16} className="text-primary/70" />
                    </h2>
                    <p className="text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
                        We are currently building comprehensive charts and analytics so you can deeply understand your traffic patterns. This feature will be available soon!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UsagePage;