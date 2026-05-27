"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── TYPES & INTERFACES ──
interface Token {
  text: string;
  color: string;
}

interface RowData {
  id: string;
  identifier: string;
  rule: string;
  allowed: boolean;
  count: number;
  time: string;
  timeColor: string;
}

// ── SYNTAX TOKENS FOR STEP 1 ──
const tokens: Token[] = [
  { text: "await ", color: "text-[#c084fc]" },
  { text: "throttlr", color: "text-zinc-300" },
  { text: ".", color: "text-zinc-300" },
  { text: "check", color: "text-[#60a5fa]" },
  { text: "({\n", color: "text-zinc-300" },
  { text: "  rule", color: "text-[#67e8f9]" },
  { text: ": ", color: "text-zinc-300" },
  { text: "'api-requests'", color: "text-[#86efac]" },
  { text: ",\n", color: "text-zinc-300" },
  { text: "  identifier", color: "text-[#67e8f9]" },
  { text: ": ", color: "text-zinc-300" },
  { text: "req.user.id", color: "text-zinc-300" },
  { text: ",\n", color: "text-zinc-300" },
  { text: "})", color: "text-zinc-300" },
];

// ── DATABASE STREAM FOR STEP 6 ──
const sampleData = [
  { identifier: "user_4821", rule: "api-requests", allowed: true, count: 87 },
  { identifier: "user_2190", rule: "api-requests", allowed: true, count: 43 },
  { identifier: "user_1192", rule: "api-requests", allowed: false, count: 100 },
  { identifier: "user_7731", rule: "api-requests", allowed: true, count: 99 },
];

// ── VISUAL STEP 1 ──
function Step1Visual() {
  const [visibleChars, setVisibleChars] = useState(0);
  const totalChars = tokens.reduce((acc, t) => acc + t.text.length, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= totalChars) return 0;
        return prev + 1;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [totalChars]);

  return (
    <div className="w-full bg-[#0d0d0f] rounded-lg border border-zinc-900/60 p-6 font-mono text-[13px] leading-relaxed min-h-[180px] flex flex-col justify-center overflow-x-auto">
      <pre className="text-zinc-300 select-none">
        <code>
          {(() => {
            let charAccumulator = 0;
            return tokens.map((token, i) => {
              const startIdx = charAccumulator;
              charAccumulator += token.text.length;
              return (
                <span key={i} className={token.color}>
                  {token.text.split("").map((char, charIdx) => {
                    const globalIdx = startIdx + charIdx;
                    const isVisible = globalIdx < visibleChars;
                    const isCurrent = globalIdx === visibleChars - 1;
                    return (
                      <span key={charIdx} className="relative">
                        <span className={isVisible ? "opacity-100" : "opacity-0"}>{char}</span>
                        {isCurrent && (
                          <span className="absolute left-full top-[2px] w-[6px] h-[13px] bg-[#ea580c] animate-pulse pointer-events-none" />
                        )}
                      </span>
                    );
                  })}
                </span>
              );
            });
          })()}
        </code>
      </pre>
    </div>
  );
}

// ── VISUAL STEP 2 ──
function Step2Visual() {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 750);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0d0d0f] rounded-lg border border-zinc-900/60 p-6 flex items-center justify-center min-h-[180px] font-mono text-[11px] select-none">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-around">
        <div className="px-3 py-2 bg-[#27272a]/60 border border-[#3f3f46] text-zinc-300 rounded-md">
          x-api-key: tk_••••••••
        </div>
        <div className={`text-[#ea580c] text-lg transition-opacity duration-500 hidden sm:block ${pulse ? "opacity-100" : "opacity-40"}`}>
          →
        </div>
        <div className={`text-[#ea580c] text-lg transition-opacity duration-500 sm:hidden ${pulse ? "opacity-100" : "opacity-40"}`}>
          ↓
        </div>
        <div className="px-3 py-2 bg-[#111113] border border-[#27272a] text-[#60a5fa] rounded-md font-semibold text-center">
          apiKeyMiddleware
        </div>
        <div className={`text-[#ea580c] text-lg transition-opacity duration-500 hidden sm:block ${pulse ? "opacity-40" : "opacity-100"}`}>
          →
        </div>
        <div className={`text-[#ea580c] text-lg transition-opacity duration-500 sm:hidden ${pulse ? "opacity-40" : "opacity-100"}`}>
          ↓
        </div>
        <div className="px-3 py-2 bg-[#052e16] border border-[#166534] text-[#4ade80] rounded-md font-semibold">
          tenantId ✓
        </div>
      </div>
    </div>
  );
}

// ── VISUAL STEP 3 ──
function Step3Visual() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount((prev) => (prev >= 5 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fields = [
    { key: "rule:", val: `"api-requests"`, color: "text-[#86efac]" },
    { key: "limit:", val: "100", color: "text-[#fb923c]" },
    { key: "window:", val: "60s", color: "text-[#fb923c]" },
    { key: "algorithm:", val: "SLIDING_WINDOW", color: "text-[#ea580c]" },
    { key: "tenantId:", val: `"tenant_abc"`, color: "text-[#67e8f9]" },
  ];

  return (
    <div className="w-full bg-[#0d0d0f] rounded-lg border border-zinc-900/60 p-6 flex flex-col justify-center min-h-[180px] font-mono text-[12px] select-none">
      <div className="bg-[#111113] border border-[#27272a] rounded-lg p-5 max-w-sm mx-auto w-full space-y-2">
        {fields.map((f, i) => {
          const isVisible = i < visibleCount;
          return (
            <div
              key={i}
              className={`flex justify-between items-center transition-all duration-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                }`}
            >
              <span className="text-[#52525b]">{f.key}</span>
              <span className={`${f.color} font-semibold`}>{f.val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── VISUAL STEP 4 ──
function Step4Visual() {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCycle((c) => c + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const isAllowed = cycle % 2 === 0;

  return (
    <div className="w-full bg-[#0d0d0f] rounded-lg border border-zinc-900/60 p-6 flex items-center justify-center min-h-[180px] font-mono text-[11px] select-none overflow-hidden relative">
      <div className="flex items-center justify-between w-full max-w-md relative">
        <div className="px-2.5 py-1.5 bg-[#18181b] border border-[#27272a] text-zinc-400 rounded z-10">
          INCR counter
        </div>

        <div className="relative w-[70px] h-[70px] flex items-center justify-center animate-pulse z-10">
          <svg className="absolute inset-0 w-full h-full text-[#ea580c]/10 fill-current stroke-[#ea580c] stroke-2" viewBox="0 0 100 100">
            <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
          </svg>
          <span className="font-mono text-[10px] font-extrabold text-[#ea580c] text-center leading-none">
            Redis<br />Lua
          </span>
        </div>

        <div className="flex flex-col gap-1.5 z-10">
          <div className={`px-2 py-1 rounded text-center border font-semibold transition-all duration-300 ${isAllowed
            ? "bg-[#052e16] border-[#166534] text-[#4ade80] scale-105"
            : "bg-zinc-950 border-zinc-900 text-zinc-600 opacity-40 scale-95"
            }`}>
            ✓ allowed
          </div>
          <div className={`px-2 py-1 rounded text-center border font-semibold transition-all duration-300 ${!isAllowed
            ? "bg-[#1c0a0a] border-[#7f1d1d] text-[#f87171] scale-105"
            : "bg-zinc-950 border-zinc-900 text-zinc-600 opacity-40 scale-95"
            }`}>
            ✗ blocked
          </div>
        </div>

        <span
          key={cycle}
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#ea580c] shadow-[0_0_8px_#ea580c] pointer-events-none"
          style={{
            animation: "step4-dot-flow 2s infinite linear"
          }}
        />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes step4-dot-flow {
          0% { left: 80px; opacity: 0; }
          10% { opacity: 1; }
          45% { left: calc(50% - 35px); opacity: 1; }
          55% { left: calc(50% + 35px); opacity: 1; }
          90% { left: calc(100% - 90px); opacity: 1; }
          100% { left: calc(100% - 90px); opacity: 0; }
        }
      `}} />
    </div>
  );
}

// ── VISUAL STEP 5 ──
function Step5Visual() {
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAllowed((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0d0d0f] rounded-lg border border-zinc-900/60 p-6 flex flex-col justify-center gap-4 min-h-[180px] font-mono text-[12px] select-none">
      <div className="max-w-xs mx-auto w-full space-y-3">
        <div className={`px-3 py-1.5 rounded border text-[11px] font-semibold text-center transition-all duration-300 ${isAllowed
          ? "bg-[#052e16] border-[#166534] text-[#4ade80]"
          : "bg-[#1c0a0a] border-[#7f1d1d] text-[#f87171]"
          }`}>
          {isAllowed ? "200 OK · 0.4ms" : "429 Too Many Requests"}
        </div>

        <div className="bg-[#111113] border border-[#27272a] rounded-lg p-4 transition-all duration-300">
          {isAllowed ? (
            <pre className="text-zinc-300 leading-relaxed">
              <code>
                {"{\n"}
                {"  "}<span className="text-zinc-400">&quot;allowed&quot;</span>: <span className="text-[#4ade80]">true</span>,{"\n"}
                {"  "}<span className="text-zinc-400">&quot;remaining&quot;</span>: <span className="text-[#e2e8f0]">87</span>,{"\n"}
                {"  "}<span className="text-zinc-400">&quot;resetAt&quot;</span>: <span className="text-[#52525b]">&quot;in 42s&quot;</span>,{"\n"}
                {"  "}<span className="text-zinc-400">&quot;latency&quot;</span>: <span className="text-[#52525b]">&quot;0.4ms&quot;</span>{"\n"}
                {"}"}
              </code>
            </pre>
          ) : (
            <pre className="text-zinc-300 leading-relaxed">
              <code>
                {"{\n"}
                {"  "}<span className="text-zinc-400">&quot;allowed&quot;</span>: <span className="text-[#f87171]">false</span>,{"\n"}
                {"  "}<span className="text-zinc-400">&quot;remaining&quot;</span>: <span className="text-[#e2e8f0]">0</span>,{"\n"}
                {"  "}<span className="text-zinc-400">&quot;retryAfter&quot;</span>: <span className="text-[#52525b]">&quot;12s&quot;</span>,{"\n"}
                {"  "}<span className="text-zinc-400">&quot;latency&quot;</span>: <span className="text-[#52525b]">&quot;0.3ms&quot;</span>{"\n"}
                {"}"}
              </code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

// ── VISUAL STEP 6 ──
function Step6Visual() {
  const [rows, setRows] = useState<RowData[]>([]);
  const nextSampleIndex = useRef(0);
  const rowCounter = useRef(0);

  useEffect(() => {
    setRows([
      { id: "row-init-1", identifier: "user_2190", rule: "api-requests", allowed: true, count: 43, time: "1s ago", timeColor: "text-[#3f3f46]" },
      { id: "row-init-2", identifier: "user_1192", rule: "api-requests", allowed: false, count: 100, time: "2s ago", timeColor: "text-[#3f3f46]" },
      { id: "row-init-3", identifier: "user_7731", rule: "api-requests", allowed: true, count: 99, time: "3s ago", timeColor: "text-[#3f3f46]" },
    ]);

    const interval = setInterval(() => {
      setRows((prevRows) => {
        const updatedPrevRows = prevRows.map((r) => {
          let nextTime = r.time;
          if (r.time === "just now") nextTime = "1s ago";
          else if (r.time === "1s ago") nextTime = "2s ago";
          else if (r.time === "2s ago") nextTime = "3s ago";
          else if (r.time === "3s ago") nextTime = "4s ago";
          return { ...r, time: nextTime, timeColor: "text-[#3f3f46]" };
        });

        const sample = sampleData[nextSampleIndex.current];
        nextSampleIndex.current = (nextSampleIndex.current + 1) % sampleData.length;
        rowCounter.current += 1;

        const newRow: RowData = {
          id: `row-${rowCounter.current}`,
          identifier: sample.identifier,
          rule: sample.rule,
          allowed: sample.allowed,
          count: sample.count,
          time: "just now",
          timeColor: "text-[#ea580c]",
        };

        return [newRow, ...updatedPrevRows].slice(0, 4);
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0d0d0f] rounded-lg border border-zinc-900/60 p-4 min-h-[180px] font-mono text-[10px] select-none flex flex-col justify-center">
      <div className="overflow-x-auto w-full border border-zinc-900 bg-[#111113]/40 rounded">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#27272a] text-[#3f3f46] font-semibold bg-[#111113]/80">
              <th className="p-2">identifier</th>
              <th className="p-2">rule</th>
              <th className="p-2">allowed</th>
              <th className="p-2">count</th>
              <th className="p-2">createdAt</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-zinc-900/40 text-zinc-300 transition-all duration-500 animate-[rowSlideIn_0.4s_ease-out]"
              >
                <td className="p-2">{row.identifier}</td>
                <td className="p-2 text-zinc-500">{row.rule}</td>
                <td className="p-2">
                  {row.allowed ? (
                    <span className="text-[#4ade80]">✓</span>
                  ) : (
                    <span className="text-[#f87171]">✗</span>
                  )}
                </td>
                <td className="p-2">{row.count}</td>
                <td className={`p-2 transition-colors duration-300 ${row.timeColor}`}>{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}

// ── STEP DEFINITIONS ──
const steps = [
  {
    num: "01",
    title: "Developer calls throttlr.check()",
    desc: "Your backend calls the SDK with a rule name and an identifier — a user ID, IP address, or any string that identifies the caller.",
    detail: "⚡ @throttlr/sdk — drop-in middleware",
    label: "sdk.check()",
    Visual: Step1Visual,
  },
  {
    num: "02",
    title: "API key verified",
    desc: "The Throttlr backend receives the request and verifies your hashed API key against PostgreSQL, mapping it to your tenant, plan, and project.",
    detail: "🔑 x-api-key header — bcrypt hashed in DB",
    label: "api key auth",
    Visual: Step2Visual,
  },
  {
    num: "03",
    title: "Rate limit rule fetched",
    desc: "Throttlr loads your matching rule from cache or database — the limit, window duration, and algorithm you configured in the dashboard.",
    detail: "📋 limit: 100 req / 60s — SLIDING_WINDOW",
    label: "rule lookup",
    Visual: Step3Visual,
  },
  {
    num: "04",
    title: "Redis Lua script executes",
    desc: "An atomic Lua script runs inside Redis — incrementing the counter and checking the limit in a single operation. No race conditions. No round trips.",
    detail: "⚡ Atomic execution — sub-millisecond",
    label: "lua eval",
    Visual: Step4Visual,
  },
  {
    num: "05",
    title: "Result returned instantly",
    desc: "Throttlr responds with allowed status, remaining count, reset time, and the algorithm used. Your app decides what to do next.",
    detail: "↩ HTTP response — JSON",
    label: "response",
    Visual: Step5Visual,
  },
  {
    num: "06",
    title: "Request logged asynchronously",
    desc: "Every check is logged to PostgreSQL in the background — identifier, rule, allowed status, and count. Powers your analytics dashboard.",
    detail: "📊 UsageLog → PostgreSQL — non-blocking",
    label: "usage log",
    Visual: Step6Visual,
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((step) => (step + 1) % 6);
          return 0;
        }
        return prev + 1;
      });
    }, 30); // 25ms * 100 = 2500ms

    return () => clearInterval(timer);
  }, []);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setProgress(0);
  };

  const currentStep = steps[activeStep];
  const StepVisualComponent = currentStep.Visual;

  return (
    <section className="w-full bg-[#0d0d0f] pt-16 pb-20 border-b border-zinc-900 select-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1440px] mx-auto px-6 relative flex flex-col gap-10"
      >

        {/* CSS Keyframes for Fade Transition on Card */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes stepFadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />

        {/* Decorative Grid Lines aligning with Navbar, Hero, Live Demo & Features */}
        <div className="absolute left-[9px] -top-16 -bottom-20 w-px bg-zinc-800 pointer-events-none ml-[15px] hidden md:block" />
        <div className="absolute right-[9px] -top-16 -bottom-20 w-px bg-zinc-800 pointer-events-none mr-[15px] hidden md:block" />

        {/* Section Header */}
        <div className="text-center flex flex-col items-center pb-8 z-10">
          <h2
            className="text-3xl sm:text-4xl md:text-4xl font-semibold text-white leading-tight font-sans"
            style={{ letterSpacing: '-0.04em' }}
          >
            From request to decision.
          </h2>
          <p className="text-[14px] text-[#52525b] mt-2 font-mono">
            Six steps. Under one millisecond.
          </p>
        </div>

        {/* ── PART 1: INTERACTIVE STEPPER ROW ── */}
        <div className="w-full z-10 px-6 md:px-10 flex flex-col gap-4">
          <div className="flex items-center justify-between w-full overflow-x-auto scrollbar-none gap-2 pb-2">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              const isCompleted = idx < activeStep;

              return (
                <React.Fragment key={idx}>
                  {/* Step Pill */}
                  <button
                    onClick={() => handleStepClick(idx)}
                    className={`flex items-center justify-center whitespace-nowrap px-4 py-2 text-[12px] font-mono rounded-full border transition-all duration-200 cursor-pointer ${isActive
                      ? "bg-[#1c0e04] border-[#ea580c] text-[#ea580c]"
                      : isCompleted
                        ? "bg-[#18181b] border-[#27272a] text-[#3f3f46]"
                        : "bg-[#18181b] border-[#27272a] text-[#52525b] hover:text-zinc-300 hover:border-zinc-700"
                      }`}
                  >
                    {isCompleted && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1 text-[#ea580c] inline-block shrink-0">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{step.label}</span>
                  </button>

                  {/* Connecting Line (omit after last step) */}
                  {idx < 5 && (
                    <div className="flex-1 min-w-[20px] h-[1px] bg-[#27272a] mx-2 relative hidden md:block">
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-[#ea580c] transition-all duration-100"
                        style={{
                          width: isCompleted ? "100%" : isActive ? `${progress}%` : "0%"
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Thin progress bar underneath indicating remaining auto-advance timer */}
          <div className="w-full h-[2px] bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ea580c] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ── PART 2: MAIN CONTENT CARD ── */}
        <div className="mx-6 md:mx-10 z-10 bg-[#111113] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl min-h-[360px] lg:min-h-[280px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 w-full h-full"
            >
              {/* Left Column: Visual Asset */}
              <div className="p-8 lg:p-12 flex items-center justify-center bg-[#0d0d0f]/20 border-b lg:border-b-0 lg:border-r border-[#27272a]">
                <StepVisualComponent />
              </div>

              {/* Right Column: Step Explanation */}
              <div className="p-8 lg:p-12 flex flex-col justify-between gap-8">
                <div className="space-y-4">
                  <span className="font-mono text-[11px] text-[#3f3f46] tracking-wider block">
                    {currentStep.num}
                  </span>
                  <h3 className="text-xl lg:text-2xl font-semibold text-white tracking-tight leading-tight">
                    {currentStep.title}
                  </h3>
                  <p className="text-[14px] text-[#71717a] leading-relaxed max-w-md">
                    {currentStep.desc}
                  </p>
                </div>

                {/* Technical Detail Footer */}
                <div className="font-mono text-[12px] text-[#52525b] pt-4 border-t border-zinc-900/60 flex items-center gap-2">
                  {currentStep.detail}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </motion.div>
    </section>
  );
}
