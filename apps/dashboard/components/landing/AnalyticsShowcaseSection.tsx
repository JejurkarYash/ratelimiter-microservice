"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, XCircle, Activity } from "lucide-react";
import { motion } from "framer-motion";

// ── TYPES ──
interface LineDataPoint {
  time: string;
  allowed: number;
  blocked: number;
}

interface BarDataPoint {
  day: string;
  allowed: number;
  blocked: number;
}

interface LogRow {
  id: string;
  identifier: string;
  rule: string;
  allowed: boolean;
  count: number;
  time: string;
  timeColor: string;
}

// ── DATA SOURCES ──
const initialLineData: LineDataPoint[] = [
  { time: "12:00", allowed: 740, blocked: 45 },
  { time: "12:01", allowed: 810, blocked: 52 },
  { time: "12:02", allowed: 790, blocked: 40 },
  { time: "12:03", allowed: 850, blocked: 68 },
  { time: "12:04", allowed: 920, blocked: 74 },
  { time: "12:05", allowed: 880, blocked: 50 },
  { time: "12:06", allowed: 940, blocked: 90 },
  { time: "12:07", allowed: 890, blocked: 60 },
  { time: "12:08", allowed: 870, blocked: 45 },
  { time: "12:09", allowed: 910, blocked: 65 },
  { time: "12:10", allowed: 950, blocked: 80 },
  { time: "12:11", allowed: 980, blocked: 85 },
];

const initialBarData: BarDataPoint[] = [
  { day: "Mon", allowed: 680, blocked: 40 },
  { day: "Tue", allowed: 720, blocked: 55 },
  { day: "Wed", allowed: 710, blocked: 48 },
  { day: "Thu", allowed: 840, blocked: 92 },
  { day: "Fri", allowed: 910, blocked: 78 },
  { day: "Sat", allowed: 820, blocked: 60 },
  { day: "Sun", allowed: 890, blocked: 72 },
];

const tableSamples = [
  { identifier: "user_4821", rule: "api-requests", allowed: true, count: 87 },
  { identifier: "user_2190", rule: "api-requests", allowed: true, count: 43 },
  { identifier: "user_1192", rule: "api-requests", allowed: false, count: 100 },
  { identifier: "user_7731", rule: "webhook-calls", allowed: true, count: 12 },
  { identifier: "user_0055", rule: "api-requests", allowed: false, count: 100 },
  { identifier: "ip_192.168.1.1", rule: "webhook-calls", allowed: true, count: 7 },
  { identifier: "user_3348", rule: "api-requests", allowed: false, count: 100 },
];

export default function AnalyticsShowcaseSection() {
  // ── ROW 1: STAT CARD STATE ──
  const [totalRequests, setTotalRequests] = useState(2400000000);
  const [blockedRequests, setBlockedRequests] = useState(1820000);

  // ── ROW 2: CHART STATES ──
  const [lineData, setLineData] = useState<LineDataPoint[]>(initialLineData);
  const [barData, setBarData] = useState<BarDataPoint[]>(initialBarData);
  const [hoveredLineIdx, setHoveredLineIdx] = useState<number | null>(null);
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);

  const lastTimeRef = useRef({ hour: 12, minute: 11 });
  const dayCounter = useRef(0);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // ── ROW 3: TABLE STREAM STATE ──
  const [rows, setRows] = useState<LogRow[]>([]);
  const [updatedSec, setUpdatedSec] = useState(0);
  const nextSampleIndex = useRef(0);
  const rowCounter = useRef(0);

  // Initialize and run metrics timers
  useEffect(() => {
    // Stat Counters
    const reqTimer = setInterval(() => {
      setTotalRequests((prev) => prev + Math.floor(Math.random() * 40000) + 10000);
    }, 2000);

    const blockedTimer = setInterval(() => {
      setBlockedRequests((prev) => prev + Math.floor(Math.random() * 4000) + 1000);
    }, 3000);

    // Line Chart (Allowed vs Blocked Time Series)
    const lineTimer = setInterval(() => {
      setLineData((prev) => {
        let nextMin = lastTimeRef.current.minute + 1;
        let nextHr = lastTimeRef.current.hour;
        if (nextMin >= 60) {
          nextMin = 0;
          nextHr = (nextHr + 1) % 24;
        }
        lastTimeRef.current = { hour: nextHr, minute: nextMin };

        const timeStr = `${String(nextHr).padStart(2, "0")}:${String(nextMin).padStart(2, "0")}`;
        const newPoint = {
          time: timeStr,
          allowed: Math.floor(Math.random() * 250) + 700,
          blocked: Math.floor(Math.random() * 60) + 30,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);

    // Bar Chart (Grouped Days)
    const barTimer = setInterval(() => {
      setBarData((prev) => {
        dayCounter.current += 1;
        const nextDay = days[dayCounter.current % 7];
        const newPoint = {
          day: nextDay,
          allowed: Math.floor(Math.random() * 200) + 700,
          blocked: Math.floor(Math.random() * 50) + 30,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 4000);

    // Table stream (Pre-populate first)
    setRows([
      { id: "log-1", identifier: "user_4821", rule: "api-requests", allowed: true, count: 87, time: "just now", timeColor: "text-[#ea580c]" },
      { id: "log-2", identifier: "user_2190", rule: "api-requests", allowed: true, count: 43, time: "1s ago", timeColor: "text-[#52525b]" },
      { id: "log-3", identifier: "user_1192", rule: "api-requests", allowed: false, count: 100, time: "2s ago", timeColor: "text-[#52525b]" },
      { id: "log-4", identifier: "user_7731", rule: "webhook-calls", allowed: true, count: 12, time: "3s ago", timeColor: "text-[#52525b]" },
      { id: "log-5", identifier: "user_0055", rule: "api-requests", allowed: false, count: 100, time: "4s ago", timeColor: "text-[#52525b]" },
    ]);

    const tableTimer = setInterval(() => {
      setRows((prevRows) => {
        const updatedPrev = prevRows.map((r) => {
          let nextTime = r.time;
          if (r.time === "just now") nextTime = "1s ago";
          else if (r.time === "1s ago") nextTime = "2s ago";
          else if (r.time === "2s ago") nextTime = "3s ago";
          else if (r.time === "3s ago") nextTime = "4s ago";
          else if (r.time === "4s ago") nextTime = "5s ago";
          else if (r.time === "5s ago") nextTime = "6s ago";
          else if (r.time === "6s ago") nextTime = "7s ago";
          return { ...r, time: nextTime, timeColor: "text-[#52525b]" };
        });

        const sample = tableSamples[nextSampleIndex.current];
        nextSampleIndex.current = (nextSampleIndex.current + 1) % tableSamples.length;
        rowCounter.current += 1;

        const newRow: LogRow = {
          id: `log-stream-${rowCounter.current}`,
          identifier: sample.identifier,
          rule: sample.rule,
          allowed: sample.allowed,
          count: sample.count,
          time: "just now",
          timeColor: "text-[#ea580c]",
        };

        setUpdatedSec(0);
        return [newRow, ...updatedPrev].slice(0, 6);
      });
    }, 1500);

    // Live update secondary elapsed timer (every 1s)
    const elapsedTimer = setInterval(() => {
      setUpdatedSec((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(reqTimer);
      clearInterval(blockedTimer);
      clearInterval(lineTimer);
      clearInterval(barTimer);
      clearInterval(tableTimer);
      clearInterval(elapsedTimer);
    };
  }, []);

  // ── AREA CHART COORDINATES MATH ──
  const lineSvgWidth = 550;
  const lineSvgHeight = 180;
  const linePadLeft = 40;
  const linePadRight = 20;
  const linePadTop = 15;
  const linePadBottom = 25;

  const getLineX = (i: number) => {
    return linePadLeft + (i * (lineSvgWidth - linePadLeft - linePadRight)) / (lineData.length - 1);
  };
  const getLineY = (val: number) => {
    const maxVal = 1100;
    const graphHeight = lineSvgHeight - linePadTop - linePadBottom;
    return lineSvgHeight - linePadBottom - (val * graphHeight) / maxVal;
  };

  const allowedLine = lineData.map((d, i) => `${i === 0 ? "M" : "L"} ${getLineX(i)} ${getLineY(d.allowed)}`).join(" ");
  const blockedLine = lineData.map((d, i) => `${i === 0 ? "M" : "L"} ${getLineX(i)} ${getLineY(d.blocked)}`).join(" ");

  const allowedArea = `${allowedLine} L ${getLineX(lineData.length - 1)} ${lineSvgHeight - linePadBottom} L ${getLineX(0)} ${lineSvgHeight - linePadBottom} Z`;
  const blockedArea = `${blockedLine} L ${getLineX(lineData.length - 1)} ${lineSvgHeight - linePadBottom} L ${getLineX(0)} ${lineSvgHeight - linePadBottom} Z`;

  // ── BAR CHART COORDINATES MATH ──
  const barSvgWidth = 350;
  const barSvgHeight = 180;
  const barPadLeft = 40;
  const barPadRight = 20;
  const barPadBottom = 25;
  const barPadTop = 15;

  const getBarGroupX = (i: number) => {
    const space = (barSvgWidth - barPadLeft - barPadRight) / barData.length;
    return barPadLeft + i * space + 8;
  };
  const getBarY = (val: number) => {
    const maxVal = 1000;
    const graphHeight = barSvgHeight - barPadTop - barPadBottom;
    return barSvgHeight - barPadBottom - (val * graphHeight) / maxVal;
  };
  const getBarH = (val: number) => {
    const maxVal = 1000;
    const graphHeight = barSvgHeight - barPadTop - barPadBottom;
    return (val * graphHeight) / maxVal;
  };

  return (
    <section className="w-full bg-[#0d0d0f] pt-16 pb-20 border-b border-zinc-900 select-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1440px] mx-auto px-6 relative flex flex-col gap-10"
      >

        {/* Dynamic Slide In Table Animation */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes logTableSlide {
            from { opacity: 0; transform: translateY(-6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />

        {/* Decorative Grid Lines aligning with Navbar, Hero, Live Demo, Features & How It Works */}
        <div className="absolute left-[9px] -top-16 -bottom-20 w-px bg-zinc-800 pointer-events-none ml-[15px] hidden md:block" />
        <div className="absolute right-[9px] -top-16 -bottom-20 w-px bg-zinc-800 pointer-events-none mr-[15px] hidden md:block" />

        {/* Section Header */}
        <div className="text-center flex flex-col items-center pb-8 z-10">
          <h2
            className="text-3xl sm:text-4xl md:text-4xl font-semibold text-white leading-tight font-sans"
            style={{ letterSpacing: '-0.04em' }}
          >
            Built-in analytics. Zero config.
          </h2>
          <p className="text-[14px] text-[#52525b] mt-2 font-mono">
            Every request logged. Every decision tracked.
          </p>
        </div>

        {/* ── DASHBOARD MOCKUP WRAPPER CARD ── */}
        <div className="mx-0 sm:mx-6 md:mx-10 z-10 bg-[#111113] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl flex flex-col">

          {/* Dashboard Header/Top Bar */}
          <div className="flex items-center justify-between bg-[#18181b] border-b border-[#27272a] h-11 px-5 select-none shrink-0">
            {/* Logo area */}
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-[13px] tracking-tight">Throttlr</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
            </div>

            {/* Monospace breadcrumb */}
            <div className="hidden sm:block font-mono text-[11px] text-[#52525b]">
              Dashboard <span className="mx-1 text-[#3f3f46]">→</span> Analytics
            </div>

            {/* Glowing LIVE Badge */}
            <div className="flex items-center gap-1.5 bg-[#052e16] border border-[#166534] text-[#4ade80] font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#4ade80]" />
              </span>
              <span>LIVE</span>
            </div>
          </div>

          {/* Inner Dashboard Body layout */}
          <div className="p-4 sm:p-6 bg-[#111113] flex flex-col gap-6 w-full">

            {/* ── ROW 1: STATS GRID ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">

              {/* Card 1: Total Requests */}
              <div className="bg-[#19191a]/80 border border-white/[0.06] rounded-xl p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
                <span className="text-[9.5px] sm:text-[11px] text-white/30 font-mono uppercase tracking-wider">Total Requests</span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mt-2 gap-1 sm:gap-0">
                  <span className="text-[15px] sm:text-xl font-bold text-white/90 font-mono">
                    {totalRequests.toLocaleString()}
                  </span>
                  <span className="text-[8.5px] sm:text-[10px] font-mono font-bold text-[#4ade80]">+12%</span>
                </div>
              </div>

              {/* Card 2: Avg Latency */}
              <div className="bg-[#19191a]/80 border border-white/[0.06] rounded-xl p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
                <span className="text-[9.5px] sm:text-[11px] text-white/30 font-mono uppercase tracking-wider">Avg Latency</span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mt-2 gap-1 sm:gap-0">
                  <span className="text-[15px] sm:text-xl font-bold text-white/90 font-mono">&lt;1ms</span>
                  <span className="text-[8.5px] sm:text-[10px] font-mono text-zinc-500">p99: 0.8ms</span>
                </div>
              </div>

              {/* Card 3: Requests Blocked */}
              <div className="bg-[#19191a]/80 border border-white/[0.06] rounded-xl p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
                <span className="text-[9.5px] sm:text-[11px] text-white/30 font-mono uppercase tracking-wider">Blocked Today</span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mt-2 gap-1 sm:gap-0">
                  <span className="text-[15px] sm:text-xl font-bold text-white/90 font-mono">
                    {blockedRequests.toLocaleString()}
                  </span>
                  <span className="text-[8.5px] sm:text-[10px] font-mono font-bold text-[#f87171]">7.2%</span>
                </div>
              </div>

              {/* Card 4: Active Rules */}
              <div className="bg-[#19191a]/80 border border-white/[0.06] rounded-xl p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
                <span className="text-[9.5px] sm:text-[11px] text-white/30 font-mono uppercase tracking-wider">Active Rules</span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mt-2 gap-1 sm:gap-0">
                  <span className="text-[15px] sm:text-xl font-bold text-white/90 font-mono">4.1K</span>
                  <span className="text-[8.5px] sm:text-[10px] font-mono font-bold text-[#4ade80]">+8%</span>
                </div>
              </div>

            </div>

            {/* ── ROW 2: CHARTS GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 w-full">

              {/* Left Chart: Request Volume */}
              <div className="lg:col-span-6 bg-[#19191a]/80 border border-white/[0.06] rounded-xl p-4 flex flex-col relative">
                <div className="border-b border-zinc-900 pb-3 mb-4">
                  <span className="font-mono text-[12px] text-[#a1a1aa] font-semibold uppercase tracking-wider">
                    Request Volume
                  </span>
                </div>

                <div className="relative w-full h-[180px]">
                  <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${lineSvgWidth} ${lineSvgHeight}`}>
                    <defs>
                      <linearGradient id="allowedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[200, 400, 600, 800, 1000].map((val) => {
                      const y = getLineY(val);
                      return (
                        <line
                          key={val}
                          x1={linePadLeft}
                          y1={y}
                          x2={lineSvgWidth - linePadRight}
                          y2={y}
                          stroke="#27272a"
                          strokeOpacity="0.3"
                          strokeDasharray="3 3"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Area paths */}
                    <path d={allowedArea} fill="url(#allowedGrad)" />
                    <path d={blockedArea} fill="url(#blockedGrad)" />

                    {/* Line paths */}
                    <path d={allowedLine} fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
                    <path d={blockedLine} fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Y Axis ticks */}
                    {[200, 600, 1000].map((val) => (
                      <text
                        key={val}
                        x={linePadLeft - 8}
                        y={getLineY(val) + 4}
                        textAnchor="end"
                        className="fill-zinc-500 font-mono text-[9px] select-none"
                      >
                        {val}
                      </text>
                    ))}

                    {/* X Axis ticks */}
                    {lineData.map((d, idx) => {
                      if (idx % 3 === 0 || idx === lineData.length - 1) {
                        return (
                          <text
                            key={idx}
                            x={getLineX(idx)}
                            y={lineSvgHeight - 8}
                            textAnchor="middle"
                            className="fill-zinc-500 font-mono text-[9px] select-none"
                          >
                            {d.time}
                          </text>
                        );
                      }
                      return null;
                    })}

                    {/* Tooltip helper vertical line */}
                    {hoveredLineIdx !== null && (
                      <line
                        x1={getLineX(hoveredLineIdx)}
                        y1={linePadTop}
                        x2={getLineX(hoveredLineIdx)}
                        y2={lineSvgHeight - linePadBottom}
                        stroke="#ea580c"
                        strokeOpacity="0.4"
                        strokeDasharray="2 2"
                        strokeWidth="1"
                      />
                    )}

                    {/* Interactive hover rect segments */}
                    {lineData.map((_, idx) => {
                      const segmentW = (lineSvgWidth - linePadLeft - linePadRight) / lineData.length;
                      return (
                        <rect
                          key={idx}
                          x={getLineX(idx) - segmentW / 2}
                          y={linePadTop}
                          width={segmentW}
                          height={lineSvgHeight - linePadTop - linePadBottom}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredLineIdx(idx)}
                          onMouseLeave={() => setHoveredLineIdx(null)}
                        />
                      );
                    })}
                  </svg>

                  {/* Inline Tooltip Box */}
                  {hoveredLineIdx !== null && (
                    <div
                      className="absolute bg-[#18181b] border border-[#27272a] p-2.5 rounded-lg shadow-xl font-mono text-[10px] text-[#e2e8f0] z-30 pointer-events-none flex flex-col gap-1 w-32 select-none"
                      style={{
                        left: `${Math.min(getLineX(hoveredLineIdx) + 15, lineSvgWidth - 145)}px`,
                        top: `${Math.max(getLineY(lineData[hoveredLineIdx].allowed) - 30, 10)}px`,
                      }}
                    >
                      <div className="font-semibold text-zinc-500 border-b border-zinc-900 pb-0.5 mb-1">
                        {lineData[hoveredLineIdx].time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                        <span className="text-zinc-400">Ok:</span>
                        <span className="font-bold text-white ml-auto">{lineData[hoveredLineIdx].allowed}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
                        <span className="text-zinc-400">Blocked:</span>
                        <span className="font-bold text-white ml-auto">{lineData[hoveredLineIdx].blocked}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Chart: Allowed vs Blocked */}
              <div className="lg:col-span-4 bg-[#19191a]/80 border border-white/[0.06] rounded-xl p-4 flex flex-col relative">
                <div className="border-b border-zinc-900 pb-3 mb-4">
                  <span className="font-mono text-[12px] text-[#a1a1aa] font-semibold uppercase tracking-wider">
                    Allowed vs Blocked
                  </span>
                </div>

                <div className="relative w-full h-[180px]">
                  <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${barSvgWidth} ${barSvgHeight}`}>

                    {/* Horizontal lines */}
                    {[200, 400, 600, 800, 1000].map((val) => {
                      const y = getBarY(val);
                      return (
                        <line
                          key={val}
                          x1={barPadLeft}
                          y1={y}
                          x2={barSvgWidth - barPadRight}
                          y2={y}
                          stroke="#27272a"
                          strokeOpacity="0.3"
                          strokeDasharray="3 3"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Render Grouped Bars */}
                    {barData.map((d, idx) => {
                      const xGroup = getBarGroupX(idx);
                      const yAllowed = getBarY(d.allowed);
                      const hAllowed = getBarH(d.allowed);
                      const yBlocked = getBarY(d.blocked);
                      const hBlocked = getBarH(d.blocked);

                      return (
                        <g key={idx}>
                          {/* Allowed Bar */}
                          <rect
                            x={xGroup}
                            y={yAllowed}
                            width={11}
                            height={hAllowed}
                            fill="#166534"
                            className="transition-all duration-300 rounded-t-sm"
                          />
                          {/* Blocked Bar */}
                          <rect
                            x={xGroup + 13}
                            y={yBlocked}
                            width={11}
                            height={hBlocked}
                            fill="#7f1d1d"
                            className="transition-all duration-300 rounded-t-sm"
                          />
                        </g>
                      );
                    })}

                    {/* Y Axis ticks */}
                    {[200, 600, 1000].map((val) => (
                      <text
                        key={val}
                        x={barPadLeft - 8}
                        y={getBarY(val) + 4}
                        textAnchor="end"
                        className="fill-zinc-500 font-mono text-[9px] select-none"
                      >
                        {val}
                      </text>
                    ))}

                    {/* X Axis ticks */}
                    {barData.map((d, idx) => (
                      <text
                        key={idx}
                        x={getBarGroupX(idx) + 12}
                        y={barSvgHeight - 8}
                        textAnchor="middle"
                        className="fill-zinc-500 font-mono text-[9px] select-none"
                      >
                        {d.day}
                      </text>
                    ))}

                    {/* Interactive hover rect segments */}
                    {barData.map((_, idx) => {
                      const space = (barSvgWidth - barPadLeft - barPadRight) / barData.length;
                      return (
                        <rect
                          key={idx}
                          x={getBarGroupX(idx) - 4}
                          y={barPadTop}
                          width={space - 4}
                          height={barSvgHeight - barPadTop - barPadBottom}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredBarIdx(idx)}
                          onMouseLeave={() => setHoveredBarIdx(null)}
                        />
                      );
                    })}

                  </svg>

                  {/* Inline Tooltip Box */}
                  {hoveredBarIdx !== null && (
                    <div
                      className="absolute bg-[#18181b] border border-[#27272a] p-2.5 rounded-lg shadow-xl font-mono text-[10px] text-[#e2e8f0] z-30 pointer-events-none flex flex-col gap-1 w-32 select-none"
                      style={{
                        left: `${Math.min(getBarGroupX(hoveredBarIdx) + 20, barSvgWidth - 140)}px`,
                        top: `${Math.max(getBarY(barData[hoveredBarIdx].allowed) - 30, 10)}px`,
                      }}
                    >
                      <div className="font-semibold text-zinc-500 border-b border-zinc-900 pb-0.5 mb-1">
                        {barData[hoveredBarIdx].day}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                        <span className="text-zinc-400">Ok:</span>
                        <span className="font-bold text-white ml-auto">{barData[hoveredBarIdx].allowed}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
                        <span className="text-zinc-400">Blocked:</span>
                        <span className="font-bold text-white ml-auto">{barData[hoveredBarIdx].blocked}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* ── ROW 3: STREAMING LOG TABLE ── */}
            <div className="bg-[#19191a]/80 border border-white/[0.06] rounded-xl overflow-hidden relative w-full flex flex-col">

              <div className="overflow-x-auto min-h-[220px]">
                <table className="w-full text-left border-collapse select-text">
                  <thead>
                    <tr className="border-b border-[#27272a] bg-[#18181b]">
                      <th className="py-2.5 px-4 text-[10px] font-mono font-semibold text-[#52525b] uppercase tracking-wider">Identifier</th>
                      <th className="py-2.5 px-4 text-[10px] font-mono font-semibold text-[#52525b] uppercase tracking-wider">Rule</th>
                      <th className="py-2.5 px-4 text-[10px] font-mono font-semibold text-[#52525b] uppercase tracking-wider">Status</th>
                      <th className="py-2.5 px-4 text-[10px] font-mono font-semibold text-[#52525b] uppercase tracking-wider">Count</th>
                      <th className="py-2.5 px-4 text-[10px] font-mono font-semibold text-[#52525b] uppercase tracking-wider text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60 font-mono text-[12px]">
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        className="group hover:bg-[#18181b]/50 border-b border-zinc-900/30 text-zinc-300 transition-colors animate-[logTableSlide_0.35s_ease-out]"
                      >
                        <td className="py-2.5 px-4 whitespace-nowrap text-white/70">{row.identifier}</td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.07] text-white/40">
                            {row.rule}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          {row.allowed ? (
                            <span className="inline-flex items-center bg-[#052e16] border border-[#166534] text-[#4ade80] rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                              ✓ allowed
                            </span>
                          ) : (
                            <span className="inline-flex items-center bg-[#1c0a0a] border border-[#7f1d1d] text-[#f87171] rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                              ✗ blocked
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap text-zinc-400">{row.count}</td>
                        <td className={`py-2.5 px-4 whitespace-nowrap text-right transition-colors duration-300 ${row.timeColor}`}>
                          {row.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Elapsed Time indicator */}
              <div className="border-t border-[#27272a] px-4 py-2 flex items-center justify-end shrink-0">
                <span className="text-[10px] font-mono text-[#3f3f46]">
                  Showing live data · updated {updatedSec}s ago
                </span>
              </div>

            </div>

          </div>

        </div>

      </motion.div>
    </section>
  );
}
