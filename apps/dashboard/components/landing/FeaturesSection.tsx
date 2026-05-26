"use client";

import React, { useEffect, useState, useRef } from "react";

// ── TYPE DEFINITIONS ──
interface BarItem {
  height: number;
  type: "allowed" | "blocked";
}

export default function FeaturesSection() {
  // ── CARD 1 STATE (Redis Lua Pipeline) ──
  const [pipelineTick, setPipelineTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPipelineTick((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // ── CARD 2 STATE (Fixed & Sliding Algorithms) ──
  const [slidingTick, setSlidingTick] = useState(0);
  const [fixedRequestCount, setFixedRequestCount] = useState(0);

  useEffect(() => {
    // Animate sliding window loop every 3s
    const slidingInterval = setInterval(() => {
      setSlidingTick((prev) => prev + 1);
    }, 3000);

    // Animate fixed window dots filling up
    const fixedInterval = setInterval(() => {
      setFixedRequestCount((prev) => (prev >= 6 ? 1 : prev + 1));
    }, 500);

    return () => {
      clearInterval(slidingInterval);
      clearInterval(fixedInterval);
    };
  }, []);

  // ── CARD 3 STATE (Drop-in SDK Typewriter) ──
  const line1 = "import { Throttlr } from '@throttlr/sdk'";
  const line2 = "const throttlr = new Throttlr({ apiKey })";
  const line3 = "await throttlr.check({ rule, identifier })";
  const lines = [line1, line2, line3];

  const [typedLines, setTypedLines] = useState<string[]>(["", "", ""]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    if (currentLineIndex < lines.length) {
      const targetLine = lines[currentLineIndex];
      if (currentCharIndex < targetLine.length) {
        const timeout = setTimeout(() => {
          setTypedLines((prev) => {
            const next = [...prev];
            next[currentLineIndex] = targetLine.slice(0, currentCharIndex + 1);
            return next;
          });
          setCurrentCharIndex((prev) => prev + 1);
        }, 35);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 300);
        return () => clearTimeout(timeout);
      }
    } else {
      setIsPaused(true);
      const timeout = setTimeout(() => {
        setTypedLines(["", "", ""]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
        setIsPaused(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, isPaused]);

  // Helpers to render typewritten syntax highlighted rows
  const renderLine1 = (count: number) => {
    const text = line1.slice(0, count);
    return (
      <span>
        {count > 0 && <span className="text-[#c084fc]">{text.slice(0, 6)}</span>}
        {count > 6 && <span className="text-zinc-300">{text.slice(6, 20)}</span>}
        {count > 20 && <span className="text-[#c084fc]">{text.slice(20, 24)}</span>}
        {count > 24 && <span className="text-[#86efac]">{text.slice(24, 40)}</span>}
      </span>
    );
  };

  const renderLine2 = (count: number) => {
    const text = line2.slice(0, count);
    return (
      <span>
        {count > 0 && <span className="text-[#c084fc]">{text.slice(0, 5)}</span>}
        {count > 5 && <span className="text-zinc-300">{text.slice(5, 16)}</span>}
        {count > 16 && <span className="text-[#c084fc]">{text.slice(16, 19)}</span>}
        {count > 19 && <span className="text-zinc-300">{text.slice(19, 20)}</span>}
        {count > 20 && <span className="text-[#60a5fa]">{text.slice(20, 28)}</span>}
        {count > 28 && <span className="text-zinc-300">{text.slice(28, 31)}</span>}
        {count > 31 && <span className="text-[#67e8f9]">{text.slice(31, 37)}</span>}
        {count > 37 && <span className="text-zinc-300">{text.slice(37, 41)}</span>}
      </span>
    );
  };

  const renderLine3 = (count: number) => {
    const text = line3.slice(0, count);
    return (
      <span>
        {count > 0 && <span className="text-[#c084fc]">{text.slice(0, 5)}</span>}
        {count > 5 && <span className="text-zinc-300">{text.slice(5, 15)}</span>}
        {count > 15 && <span className="text-[#60a5fa]">{text.slice(15, 20)}</span>}
        {count > 20 && <span className="text-zinc-300">{text.slice(20, 23)}</span>}
        {count > 23 && <span className="text-[#67e8f9]">{text.slice(23, 27)}</span>}
        {count > 27 && <span className="text-zinc-300">{text.slice(27, 29)}</span>}
        {count > 29 && <span className="text-[#67e8f9]">{text.slice(29, 39)}</span>}
        {count > 39 && <span className="text-zinc-300">{text.slice(39, 42)}</span>}
      </span>
    );
  };

  // ── CARD 4 STATE (Real-time Analytics Bar Chart) ──
  const [bars, setBars] = useState<BarItem[]>([
    { height: 40, type: "allowed" },
    { height: 65, type: "allowed" },
    { height: 80, type: "allowed" },
    { height: 25, type: "blocked" },
    { height: 50, type: "allowed" },
    { height: 75, type: "allowed" },
    { height: 35, type: "allowed" },
    { height: 90, type: "allowed" },
    { height: 45, type: "blocked" },
    { height: 60, type: "allowed" },
    { height: 85, type: "allowed" },
    { height: 30, type: "allowed" },
  ]);

  useEffect(() => {
    const chartInterval = setInterval(() => {
      setBars((prevBars) => {
        const randomIndex = Math.floor(Math.random() * 12);
        const nextBars = [...prevBars];
        const nextHeight = Math.floor(Math.random() * 80) + 15; // Between 15% and 95%
        nextBars[randomIndex] = {
          ...nextBars[randomIndex],
          height: nextHeight,
        };
        return nextBars;
      });
    }, 2000);
    return () => clearInterval(chartInterval);
  }, []);

  return (
    <section className="w-full bg-[#0d0d0f] pt-20 pb-0 border-b border-zinc-800 select-none">

      {/* CSS Keyframes for Hexagon Pulse and Pipeline request dot flow */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes req-flow {
          0% { left: 24px; opacity: 0; }
          10% { opacity: 1; }
          45% { left: 50%; transform: translateX(-50%); opacity: 1; }
          50% { left: 50%; transform: translateX(-50%); opacity: 0.1; }
          55% { left: 50%; transform: translateX(-50%); opacity: 1; }
          90% { left: calc(100% - 70px); opacity: 1; }
          100% { left: calc(100% - 70px); opacity: 0; }
        }
        @keyframes redis-pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.08); filter: brightness(1.2) drop-shadow(0 0 12px rgba(234, 88, 12, 0.3)); }
        }
        @keyframes sliding-window {
          0% { left: 8px; }
          100% { left: calc(100% - 80px); }
        }
      `}} />

      <div className="max-w-[1440px] mx-auto px-6 relative">

        {/* Decorative Grid Lines aligning with Navbar, Hero & Live Demo */}
        <div className="absolute left-[9px] -top-20 -bottom-20 w-px bg-zinc-800 pointer-events-none ml-[15px]" />
        <div className="absolute right-[9px] -top-20 -bottom-20 w-px bg-zinc-800 pointer-events-none mr-[15px]" />

        {/* Section Header */}
        <div className="text-center flex flex-col items-center pb-16">
          {/* <span className="font-mono text-[13px] text-[#ea580c] font-semibold tracking-wider uppercase mb-3">
            Why Throttlr
          </span> */}
          <h2
            className="text-3xl sm:text-4xl md:text-4xl font-semibold text-white leading-tight"
            style={{ letterSpacing: '-0.04em' }}
          >
            Protect your API. Ship faster.
          </h2>
        </div>

        {/* Horizontal Divider Line */}
        <div className="w-full border-t border-zinc-800 pointer-events-none" />

        {/* 2x2 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full">

          {/* ── CARD 1: REDIS LUA ── */}
          <div className="bg-[#111113]/50 border-b md:border-r border-zinc-800 rounded-none py-16 px-8 sm:py-20 sm:px-12 md:py-24 md:px-16 flex flex-col justify-between gap-10 hover:bg-[#141416]/80 transition-colors duration-300">

            {/* Live pipeline asset */}
            <div className="relative w-full h-[180px] bg-[#0d0d0f] rounded-lg border border-zinc-900/60 overflow-hidden flex items-center justify-center">

              {/* Dashed timeline pipeline line */}
              <div className="absolute left-10 right-10 top-[90px] border-t-2 border-dashed border-[#27272a] -z-10" />

              {/* Animating request pill */}
              <span
                key={pipelineTick}
                style={{ animation: "req-flow 2s infinite linear" }}
                className="absolute top-[78px] z-20 bg-[#ea580c]/10 border border-[#ea580c]/30 text-[#ea580c] px-1.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-wide leading-none"
              >
                req
              </span>

              {/* Left Column: Input req source */}
              <div className="absolute left-6 top-[76px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-1 rounded text-[11px] font-mono leading-none z-10">
                client
              </div>

              {/* Center Column: Redis Hexagon Node */}
              <div
                style={{ animation: "redis-pulse 2s infinite ease-in-out" }}
                className="absolute left-1/2 top-[60px] -translate-x-1/2 w-[60px] h-[60px] flex items-center justify-center z-10 cursor-default"
              >
                {/* SVG Hexagon background */}
                <svg className="absolute inset-0 w-full h-full text-[#ea580c]/10 fill-current stroke-[#ea580c] stroke-2" viewBox="0 0 100 100">
                  <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
                </svg>
                <span className="font-mono text-[12px] font-extrabold text-[#ea580c] z-20">Lua</span>
              </div>

              {/* Right Column: Speed/Latency target */}
              <div className="absolute right-6 top-[76px] bg-[#4ade80]/10 border border-[#4ade80]/20 text-[#4ade80] px-2 py-1 rounded text-[11px] font-mono font-bold leading-none z-10">
                0.4ms
              </div>
            </div>

            {/* Description info */}
            <div>
              <h3 className="text-[17px] font-bold text-white mb-2 font-sans">
                Sub-millisecond decisions
              </h3>
              <p className="text-[14px] text-[#52525b] font-medium leading-relaxed font-sans">
                Every rate limit check runs inside Redis via an atomic Lua script — race-condition safe, no round trips, no overhead.
              </p>
            </div>
          </div>

          {/* ── CARD 2: ALGORITHMS ── */}
          <div className="bg-[#111113]/50 border-b border-zinc-800 rounded-none py-16 px-8 sm:py-20 sm:px-12 md:py-24 md:px-16 flex flex-col justify-between gap-10 hover:bg-[#141416]/80 transition-colors duration-300">

            {/* Algorithms visualization panel */}
            <div className="grid grid-cols-2 w-full h-[180px] bg-[#0d0d0f] rounded-lg border border-zinc-900/60 overflow-hidden relative">

              {/* Center divider line */}
              <div className="absolute top-6 bottom-6 left-1/2 w-px bg-[#27272a]" />

              {/* Left Column: Fixed Window */}
              <div className="flex flex-col justify-between p-4 h-full">
                <div className="flex items-end justify-center gap-1.5 h-20 mt-4">
                  {[0, 1, 2].map((i) => {
                    const isActive = i === 1; // Middle block active
                    return (
                      <div
                        key={i}
                        className={`w-12 h-10 border rounded flex flex-wrap items-center justify-center p-1 transition-all ${isActive
                          ? "bg-[#1c0e04] border-[#7c2d12]"
                          : "bg-[#27272a]/20 border-[#27272a]"
                          }`}
                      >
                        {isActive && Array.from({ length: fixedRequestCount }).map((_, dotIndex) => (
                          <span
                            key={dotIndex}
                            className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-scale-in m-0.5"
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
                <span className="text-[10px] font-mono text-[#52525b] font-bold tracking-wider text-center select-none">
                  FIXED_WINDOW
                </span>
              </div>

              {/* Right Column: Sliding Window */}
              <div className="flex flex-col justify-between p-4 h-full overflow-hidden">
                <div className="relative w-full h-12 border border-[#27272a] bg-[#27272a]/10 rounded mt-8">

                  {/* Sliding window selection block */}
                  <div
                    style={{ animation: "sliding-window 3s infinite linear" }}
                    className="absolute top-0 bottom-0 w-[70px] bg-[#1c0e04] border-l border-r border-[#ea580c] z-10"
                  />

                  {/* Fixed distributed request dots */}
                  <div className="absolute inset-0 flex justify-around items-center px-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] z-20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] z-20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#ea580c] font-bold tracking-wider text-center select-none mt-2">
                  SLIDING_WINDOW
                </span>
              </div>
            </div>

            {/* Description info */}
            <div>
              <h3 className="text-[17px] font-bold text-white mb-2 font-sans">
                Fixed & Sliding Window
              </h3>
              <p className="text-[14px] text-[#52525b] font-medium leading-relaxed font-sans">
                Choose the algorithm that fits your use case. Fixed Window for simplicity, Sliding Window for precision traffic control.
              </p>
            </div>
          </div>

          {/* ── CARD 3: DROP-IN SDK ── */}
          <div className="bg-[#111113]/50 border-b md:border-b-0 md:border-r border-zinc-800 rounded-none py-16 px-8 sm:py-20 sm:px-12 md:py-24 md:px-16 flex flex-col justify-between gap-10 hover:bg-[#141416]/80 transition-colors duration-300">

            {/* SDK Code typewriter editor */}
            <div className="w-full h-[180px] bg-[#0d0d0f] rounded-lg border border-zinc-900/60 p-6 font-mono text-[12px] leading-relaxed relative flex flex-col justify-center select-none overflow-hidden">
              <div className="space-y-1.5">
                {/* Line 1 */}
                <div className="relative min-h-[18px] flex items-center">
                  {renderLine1(typedLines[0].length)}
                  {currentLineIndex === 0 && (
                    <span className="w-[6px] h-[14px] bg-[#ea580c] animate-pulse ml-0.5" />
                  )}
                </div>
                {/* Line 2 */}
                <div className="relative min-h-[18px] flex items-center">
                  {renderLine2(typedLines[1].length)}
                  {currentLineIndex === 1 && (
                    <span className="w-[6px] h-[14px] bg-[#ea580c] animate-pulse ml-0.5" />
                  )}
                </div>
                {/* Line 3 */}
                <div className="relative min-h-[18px] flex items-center">
                  {renderLine3(typedLines[2].length)}
                  {currentLineIndex === 2 && (
                    <span className="w-[6px] h-[14px] bg-[#ea580c] animate-pulse ml-0.5" />
                  )}
                </div>
              </div>
            </div>

            {/* Description info */}
            <div>
              <h3 className="text-[17px] font-bold text-white mb-2 font-sans">
                One import. Instant protection.
              </h3>
              <p className="text-[14px] text-[#52525b] font-medium leading-relaxed font-sans">
                Install @throttlr/sdk, pass your API key, call throttlr.check(). Your endpoint is protected in under a minute.
              </p>
            </div>
          </div>

          {/* ── CARD 4: REAL-TIME ANALYTICS ── */}
          <div className="bg-[#111113]/50 rounded-none py-16 px-8 sm:py-20 sm:px-12 md:py-24 md:px-16 flex flex-col justify-between gap-10 hover:bg-[#141416]/80 transition-colors duration-300">

            {/* Real-time bar chart preview */}
            <div className="w-full h-[180px] bg-[#0d0d0f] rounded-lg border border-zinc-900/60 p-6 flex flex-col justify-between">

              {/* Graph bars container */}
              <div className="flex-1 flex items-end justify-between gap-[5px] h-[110px] px-1 pb-1">
                {bars.map((bar, index) => (
                  <div
                    key={index}
                    style={{ height: `${bar.height}%` }}
                    className={`w-full rounded-t transition-all duration-400 ease-out ${bar.type === "allowed" ? "bg-[#166534]" : "bg-[#7f1d1d]"
                      }`}
                  />
                ))}
              </div>

              {/* Statistics row */}
              <div className="flex justify-between items-center border-t border-zinc-900/60 pt-4 font-mono text-[11px] text-[#52525b] select-none leading-none">
                <span>2.4B requests logged</span>
                <span>·</span>
                <span className="text-[#f87171] font-semibold">18.2M blocked</span>
              </div>
            </div>

            {/* Description info */}
            <div>
              <h3 className="text-[17px] font-bold text-white mb-2 font-sans">
                Every request. Logged.
              </h3>
              <p className="text-[14px] text-[#52525b] font-medium leading-relaxed font-sans">
                Throttlr asynchronously logs every check to PostgreSQL — identifier, rule, allowed status, count. Charts included in your dashboard.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
