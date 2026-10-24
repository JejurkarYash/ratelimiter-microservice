"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { SLOW_REQUEST_EVENT } from "@/services/axios";

interface SlowRequestDetail {
    durationMs: number;
}

const NOTICE_DURATION_MS = 8000;

export default function SlowRequestNotice() {
    const [durationMs, setDurationMs] = useState<number | null>(null);

    useEffect(() => {
        const handleSlowRequest = (event: Event) => {
            const detail = (event as CustomEvent<SlowRequestDetail>).detail;
            setDurationMs(detail.durationMs);
        };

        window.addEventListener(SLOW_REQUEST_EVENT, handleSlowRequest);
        return () => window.removeEventListener(SLOW_REQUEST_EVENT, handleSlowRequest);
    }, []);

    useEffect(() => {
        if (durationMs === null) return;

        const timeout = window.setTimeout(() => setDurationMs(null), NOTICE_DURATION_MS);
        return () => window.clearTimeout(timeout);
    }, [durationMs]);

    if (durationMs === null) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed right-4 top-[68px] z-50 w-[min(calc(100vw-2rem),360px)] rounded-xl border border-primary/20 bg-[#19191a] p-4 shadow-2xl shadow-black/30"
        >
            <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <AlertTriangle size={15} className="text-primary/80" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <p className="text-[12px] font-semibold tracking-wide text-white/85">
                            The backend is waking up
                        </p>
                        <button
                            type="button"
                            aria-label="Dismiss warning"
                            onClick={() => setDurationMs(null)}
                            className="shrink-0 text-white/30 transition-colors hover:text-white/70"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
                        Render&apos;s free tier may need a moment to start after being idle. This request took{" "}
                        <span className="font-mono text-primary/75">
                            {(durationMs / 1000).toFixed(1)}s
                        </span>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
