"use client";

import React, { useState, useEffect } from "react";

type TabType = "normal" | "limited" | "burst";

export default function LiveDemoSection() {
  const [activeTab, setActiveTab] = useState<TabType>("normal");
  const [visibleTab, setVisibleTab] = useState<TabType>("normal");
  const [isFading, setIsFading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsFading(true);
    const timer = setTimeout(() => {
      setVisibleTab(activeTab);
      setIsFading(false);
    }, 150); // Matches transition duration
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText("npm install @throttlr/sdk");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Tab configurations
  const progressPercent = activeTab === "normal" ? 13 : 100;
  const progressBarColor = activeTab === "normal" ? "bg-[#ea580c]" : "bg-[#f87171]";
  const progressTextColor = activeTab === "normal" ? "text-[#ea580c]" : "text-[#f87171]";

  const latency = {
    normal: "0.4ms",
    limited: "0.2ms",
    burst: "0.3ms",
  }[visibleTab];

  return (
    <section className="w-full bg-[#0d0d0f] py-20 border-b border-zinc-900 select-none ">
      <div className="max-w-[1440px] mx-auto px-6 relative flex flex-col gap-10 ">

        {/* Decorative Grid Lines aligning with Navbar & Hero */}
        <div className="absolute left-[9px] -top-20 -bottom-20 w-px bg-zinc-800 pointer-events-none ml-[15px]" />
        <div className="absolute right-[9px] -top-20 -bottom-20 w-px bg-zinc-800 pointer-events-none mr-[15px]" />

        {/* ── PART 1: INTERACTIVE DEMO PANEL ── */}
        <div className="mx-6 md:mx-10 z-10 bg-[#111113] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl flex flex-col">

          {/* Tab Bar Header */}
          <div className="flex border-b border-[#27272a] bg-[#141416]/50">
            {(["normal", "limited", "burst"] as const).map((tab) => {
              const label = {
                normal: "Normal traffic",
                limited: "Rate limited",
                burst: "Burst spike",
              }[tab];

              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-[13px] font-mono font-medium transition-all duration-200 border-b-2 hover:cursor-pointer ${isActive
                    ? "bg-[#1c1c1f] text-white border-b-[#ea580c]"
                    : "text-[#52525b] border-b-transparent hover:text-zinc-300 hover:bg-[#161619]/30"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Code Editor & Response Split Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left Column: Code Editor */}
            <div className="bg-[#0d0d0f] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3f3f46]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3f3f46]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3f3f46]" />
                </div>
                <span className="font-mono text-[12px] text-[#52525b]">
                  middleware.ts
                </span>
                <div className="w-10" /> {/* Spacer */}
              </div>

              {/* Syntax Highlighted Code block */}
              <div className="p-2 overflow-x-auto">
                <pre className="font-mono text-[13px] leading-relaxed text-zinc-300">
                  <code>
                    <div>
                      <span className="text-[#c084fc]">const</span> result = <span className="text-[#c084fc]">await</span> throttlr.<span className="text-[#60a5fa]">check</span>({'{'}
                    </div>
                    <div>
                      {"  "}<span className="text-[#67e8f9]">rule</span>: <span className="text-[#86efac]">&apos;api-requests&apos;</span>,
                    </div>
                    <div>
                      {"  "}<span className="text-[#67e8f9]">identifier</span>: req.user.id,
                    </div>
                    <div>
                      {'}'})
                    </div>
                    <br />
                    <div>
                      <span className="text-[#c084fc]">if</span> (!result.<span className="text-[#67e8f9]">allowed</span>) {'{'}
                    </div>
                    <div>
                      {"  "}<span className="text-[#c084fc]">return</span> res.<span className="text-[#60a5fa]">status</span>(<span className="text-[#fb923c]">429</span>).<span className="text-[#60a5fa]">json</span>({'{'}
                    </div>
                    <div>
                      {"    "}<span className="text-[#67e8f9]">error</span>: <span className="text-[#86efac]">&apos;Too many requests&apos;</span>,
                    </div>
                    <div>
                      {"    "}<span className="text-[#67e8f9]">retryAfter</span>: result.resetAt,
                    </div>
                    <div>
                      {"  "}{'}'})
                    </div>
                    <div>
                      {'}'}
                    </div>
                  </code>
                </pre>
              </div>
            </div>

            {/* Right Column: Live Response Panel */}
            <div className="bg-[#111113] border-t lg:border-t-0 lg:border-l border-[#27272a] p-6 flex flex-col justify-between min-h-[300px]">

              {/* Response Panel Header */}
              <div>
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                  <span className="font-mono text-[12px] text-[#52525b]">
                    response
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-950 border border-zinc-900 text-[#3f3f46] font-semibold">
                    {latency}
                  </span>
                </div>

                {/* Animated JSON Display area */}
                <div className={`transition-all duration-200 p-2 ${isFading ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
                  }`}>
                  {visibleTab === "normal" && (
                    <pre className="font-mono text-[13px] leading-relaxed text-zinc-300">
                      <code>
                        <div>{'{'}</div>
                        <div>  <span className="text-zinc-400">&quot;allowed&quot;</span>: <span className="text-[#4ade80]">true</span>,</div>
                        <div>  <span className="text-zinc-400">&quot;remaining&quot;</span>: <span className="text-[#e2e8f0]">87</span>,</div>
                        <div>  <span className="text-zinc-400">&quot;limit&quot;</span>: <span className="text-[#e2e8f0]">100</span>,</div>
                        <div>  <span className="text-zinc-400">&quot;algorithm&quot;</span>: <span className="text-[#ea580c]">&quot;SLIDING_WINDOW&quot;</span>,</div>
                        <div>  <span className="text-zinc-400">&quot;resetAt&quot;</span>: <span className="text-[#52525b]">&quot;in 42s&quot;</span></div>
                        <div>{'}'}</div>
                      </code>
                    </pre>
                  )}

                  {visibleTab === "limited" && (
                    <pre className="font-mono text-[13px] leading-relaxed text-zinc-300">
                      <code>
                        <div>{'{'}</div>
                        <div>  <span className="text-zinc-400">&quot;allowed&quot;</span>: <span className="text-[#f87171]">false</span>,</div>
                        <div>  <span className="text-zinc-400">&quot;remaining&quot;</span>: <span className="text-[#e2e8f0]">0</span>,</div>
                        <div>  <span className="text-zinc-400">&quot;limit&quot;</span>: <span className="text-[#e2e8f0]">100</span>,</div>
                        <div>  <span className="text-zinc-400">&quot;retryAfter&quot;</span>: <span className="text-[#f87171]">&quot;in 12s&quot;</span>,</div>
                        <div>  <span className="text-zinc-400">&quot;algorithm&quot;</span>: <span className="text-[#ea580c]">&quot;SLIDING_WINDOW&quot;</span></div>
                        <div>{'}'}</div>
                      </code>
                    </pre>
                  )}

                  {visibleTab === "burst" && (
                    <pre className="font-mono text-[13px] leading-relaxed text-zinc-300">
                      <code>
                        <div>{'{'}</div>
                        <div>  <span className="text-zinc-400">&quot;allowed&quot;</span>: <span className="text-[#f87171]">false</span>,</div>
                        <div>  <span className="text-zinc-400">&quot;remaining&quot;</span>: <span className="text-[#e2e8f0]">0</span>,</div>
                        <div>  <span className="text-zinc-400">&quot;limit&quot;</span>: <span className="text-[#e2e8f0]">100</span>,</div>
                        <div>  <span className="text-zinc-400">&quot;blocked&quot;</span>: <span className="text-[#f87171]">47</span>,</div>
                        <div>  <span className="text-zinc-400">&quot;algorithm&quot;</span>: <span className="text-[#ea580c]">&quot;FIXED_WINDOW&quot;</span></div>
                        <div>{'}'}</div>
                      </code>
                    </pre>
                  )}
                </div>
              </div>

              {/* Progress Bar Footer */}
              <div className="space-y-2 mt-6 pt-4 border-t border-zinc-900/60">
                <div className="flex justify-between items-center text-[12px] font-mono font-medium text-zinc-500">
                  <span>requests used</span>
                  <span className={`${progressTextColor} font-bold transition-colors duration-200`}>
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${progressBarColor} transition-all duration-300 ease-out`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── PART 2: INSTALL COMMAND BAR ── */}
        <div className="mx-6 md:mx-10 z-10 flex justify-center mt-4">
          <div className="flex items-center justify-between bg-[#111113] border border-[#27272a] rounded-lg py-3.5 px-6 w-full max-w-lg select-text transition-all hover:border-[#ea580c]/50">
            <span className="font-mono text-[14px] text-zinc-300">
              <span className="text-[#71717a]">npm install </span>
              <span className="text-[#ea580c] font-semibold">@throttlr/sdk</span>
            </span>

            <button
              onClick={handleCopy}
              className="text-[#52525b] hover:text-zinc-300 transition-colors ml-6 cursor-pointer"
              title="Copy install command"
            >
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4.5 h-4.5 text-emerald-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4.5 h-4.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v10.5c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.375z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
