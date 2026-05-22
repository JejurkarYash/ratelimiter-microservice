import React from "react";
import { Wrench } from "lucide-react";

const UsagePage = () => {
    return (
        <div className="max-w-5xl w-full flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">Project</p>
                    <h1 className="text-[18px] font-semibold text-white/90 tracking-tight leading-none">Usage Analytics</h1>
                </div>
            </div>

            {/* Coming soon notice */}
            <div className="bg-[#19191a] border border-dashed border-white/[0.07] rounded-xl py-20 px-8 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                    <Wrench size={15} className="text-white/25" />
                </div>
                <div>
                    <p className="text-[13px] font-mono font-semibold text-white/50 mb-1">under development</p>
                    <p className="text-[11px] font-mono text-white/25 max-w-xs leading-relaxed">
                        Detailed charts and analytics for traffic patterns are coming soon.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UsagePage;