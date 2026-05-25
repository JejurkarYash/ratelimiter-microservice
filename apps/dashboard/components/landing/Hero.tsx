"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full bg-[#09090b] border-b border-zinc-800 overflow-hidden min-h-[calc(100vh-80px)] flex items-center">
      {/* Background Subtle Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.35) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1440px] mx-auto w-full px-4  pt-10 pb-20  lg:pb-32 min-h-full flex flex-col lg:flex-row items-center justify-between gap-12  ">
        {/* Left vertical border line matching the Navbar */}
        <div className="absolute left-[39px] -top-[1px] bottom-0 w-px bg-zinc-800 pointer-events-none" />

        {/* Right vertical border line matching the Navbar */}
        <div className="absolute right-[39px] -top-[1px] bottom-0 w-px bg-zinc-800 pointer-events-none" />

        <div className="flex-1 z-10 select-none ml-6 pt-0 pb-4 px-4">
          <div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-medium tracking-tight text-white font-mono leading-none mb-6">
              Next Generation
              <span className="block mt-2">Rate Limiting</span>
            </h1>
            <p className="text-md  text-zinc-400 font-mono max-w-xl leading-relaxed">
              Drop-in SDK middleware. Redis-powered. Sub-millisecond decisions at any scale.
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-xl text-[15px] font-semibold hover:bg-[#ea580c] active:scale-[0.98] transition-all duration-200 font-mono shadow-[0_4px_20px_rgba(249,115,22,0.2)] hover:shadow-[0_6px_24px_rgba(249,115,22,0.35)]"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="https://github.com/JejurkarYash/ratelimiter-microservice"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-[#121214] hover:bg-[#18181b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-6 py-3 rounded-xl text-[15px] font-medium active:scale-[0.98] transition-all duration-200 font-mono"
            >
              View on GitHub
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </Link>
          </div>


        </div>

        {/* ── RIGHT PANEL: CODE INTERACTIVE CONTAINER ── */}
        <div className="w-full lg:w-auto pr-[5px] z-10 flex justify-center lg:justify-end">
          <div className="w-full max-w-[480px] bg-[#121214] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-[13px] leading-relaxed">
            {/* Terminal Titlebar Header */}
            <div className="flex items-center gap-1.5 px-5 py-4 border-b border-zinc-900 bg-[#0d0d0f]">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>

            {/* Code Content Container */}
            <div className="p-6 text-zinc-300 space-y-4">
              {/* Terminal Install Prompt */}
              <div className="flex items-center gap-2">
                <span className="text-[#F97316]">$</span>
                <span>
                  npm install <span className="text-[#F97316]">throttlr</span>
                </span>
              </div>

              {/* Code Script Block */}
              <div className="space-y-1 pt-2 border-t border-zinc-900">
                <div className="text-zinc-500 font-medium">// basic usage</div>

                <div>
                  <span className="text-[#ea580c]">import</span>{" "}
                  <span className="text-white">&#123;</span> Throttlr{" "}
                  <span className="text-white">&#125;</span>{" "}
                  <span className="text-[#ea580c]">from</span>{" "}
                  <span className="text-cyan-400">&apos;throttlr&apos;</span>
                  <span className="text-zinc-500">;</span>
                </div>

                <div className="pt-2">
                  <span className="text-[#ea580c]">const</span> limiter{" "}
                  <span className="text-white">=</span>{" "}
                  <span className="text-[#ea580c]">new</span>{" "}
                  <span className="text-white">Throttlr(</span>
                  <span className="text-white">&#123;</span>
                </div>

                <div className="pl-4">
                  points<span className="text-zinc-500">:</span>{" "}
                  <span className="text-[#F97316]">10</span>
                  <span className="text-zinc-500">,</span>
                </div>

                <div className="pl-4">
                  duration<span className="text-zinc-500">:</span>{" "}
                  <span className="text-[#F97316]">60</span>
                  <span className="text-zinc-500">,</span>{" "}
                  <span className="text-zinc-500 font-medium">// seconds</span>
                </div>

                <div className="pl-4">
                  driver<span className="text-zinc-500">:</span>{" "}
                  <span className="text-cyan-400">&apos;redis&apos;</span>
                </div>

                <div>
                  <span className="text-white">&#125;</span>
                  <span className="text-white">)</span>
                  <span className="text-zinc-500">;</span>
                </div>

                <div className="pt-2">
                  <span className="text-[#ea580c]">await</span> limiter
                  <span className="text-zinc-400">.</span>
                  <span className="text-white">consume(</span>ipAddress
                  <span className="text-white">)</span>
                  <span className="text-zinc-500">;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
