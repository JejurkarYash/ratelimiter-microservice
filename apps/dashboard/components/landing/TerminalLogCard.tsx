"use client";

import React, { useEffect, useState, useRef } from "react";

const logsData = [
  { ok: true, id: 'user_4821', rem: 'remaining: 87' },
  { ok: true, id: 'user_2190', rem: 'remaining: 43' },
  { ok: false, id: 'user_1192', rem: 'limit reached' },
  { ok: true, id: 'user_7731', rem: 'remaining: 99' },
  { ok: true, id: 'user_0055', rem: 'remaining: 12' },
  { ok: false, id: 'user_3348', rem: 'limit reached' },
  { ok: true, id: 'user_9910', rem: 'remaining: 67' },
];

interface LogItem {
  ok: boolean;
  id: string;
  rem: string;
  latency: string;
}

export default function TerminalLogCard() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleIndexRef = useRef(7); // Start cycling from index 7 since 0-6 are pre-populated

  useEffect(() => {
    // 1. Pre-populate with all 7 logs on mount to fill the screen
    const initial = logsData.slice(0, 7).map(item => ({
      ...item,
      latency: `${(Math.random() * (0.6 - 0.2) + 0.2).toFixed(1)}ms`
    }));
    setLogs(initial);

    // 2. Set interval to add new lines every 1400ms
    const interval = setInterval(() => {
      setLogs(prevLogs => {
        // Get the next item to cycle through
        const currentIndex = cycleIndexRef.current % logsData.length;
        const nextItem = logsData[currentIndex];
        cycleIndexRef.current += 1;

        const newLog: LogItem = {
          ...nextItem,
          latency: `${(Math.random() * (0.6 - 0.2) + 0.2).toFixed(1)}ms`
        };

        const updatedLogs = [...prevLogs, newLog];
        // Keep maximum of 11 lines visible for a richer, taller stream list
        if (updatedLogs.length > 11) {
          updatedLogs.shift();
        }
        return updatedLogs;
      });
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group w-full max-w-[580px] h-[420px]">
      {/* Orange background glow that increases on hover */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-[#ea580c] to-amber-500 rounded-none opacity-25 blur-2xl transition-all duration-500 group-hover:opacity-45 group-hover:blur-3xl -z-10 pointer-events-none" />

      {/* Terminal Container */}
      <div className="w-full h-full bg-[#09090b]/80 backdrop-blur-xl border border-zinc-800/80 rounded-none overflow-hidden shadow-2xl flex flex-col transition-all duration-300">
        {/* Titlebar */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-950/80 border-b border-zinc-800/60 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/75" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/75" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/75" />
          </div>

          {/* Terminal Title / Mode Tabs */}
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-mono text-zinc-400 tracking-wider font-bold">
              request stream
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-[#4ade80] font-mono tracking-normal font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              LIVE
            </div>
          </div>

          <div className="w-16" /> {/* Balancing spacer */}
        </div>

        {/* Log Body Container */}
        <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden bg-gradient-to-b from-transparent to-zinc-950/10">
          {/* Faded edges to blend items at the top and bottom bounds */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#09090b]/40 to-transparent pointer-events-none z-20" />
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#09090b]/80 to-transparent pointer-events-none z-20" />

          <div
            ref={containerRef}
            className="p-6 flex-1 flex flex-col justify-start gap-1 select-none overflow-hidden"
          >
            {/* CLI Initialization row */}
            <div className="font-mono text-[11px] text-zinc-600 border-b border-zinc-800/40 pb-2 mb-2 flex items-center gap-1.5 select-none">
              <span className="text-[#F97316]">❯</span>
              <span>throttlr monitor --live --port 3000</span>
            </div>

            {logs.map((log, index) => (
              <div
                key={index}
                className="grid grid-cols-[20px_130px_90px_140px_1fr] gap-4 font-mono text-[13px] items-center py-1.5 px-3 hover:bg-white/[0.02] border border-transparent hover:border-zinc-850 rounded-lg transition-all duration-150 -mx-3"
              >
                {/* 1. Status icon badge */}
                <div className="flex items-center">
                  {log.ok ? (
                    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.1)]">
                      <svg className="w-3 h-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 2. Identifier with user/key icon */}
                <div className="flex items-center text-zinc-300 font-medium">
                  <svg className="w-3 h-3 text-zinc-600 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="truncate">{log.id}</span>
                </div>

                {/* 3. Status text badge */}
                <div>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] uppercase font-mono font-bold tracking-wider ${log.ok
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                    {log.ok ? "allowed" : "blocked"}
                  </span>
                </div>

                {/* 4. Remaining label */}
                <div className="flex items-center text-zinc-500">
                  <span className={`text-[12px] ${log.ok ? "text-zinc-500" : "text-rose-500/30"}`}>
                    {log.rem}
                  </span>
                </div>

                {/* 5. Latency styled with a clock icon */}
                <div className="flex items-center justify-end text-zinc-500 font-mono text-xs">
                  <svg className="w-3 h-3 text-zinc-700 mr-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-zinc-500 font-semibold">{log.latency}</span>
                </div>
              </div>
            ))}

            {/* Blinking cursor block at the bottom */}
            <div className="flex items-center mt-2 px-1">
              <span className="w-1.5 h-3 bg-[#ea580c] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
