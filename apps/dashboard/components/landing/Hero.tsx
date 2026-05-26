"use client";

import Link from "next/link";
import { Component as CTAButton } from "@/components/ui/button-1";
import TerminalLogCard from "./TerminalLogCard";

export default function Hero() {
  return (
    <section className="relative w-full bg-[#09090b] border-b border-zinc-800 overflow-hidden min-h-[calc(100vh-80px)] flex items-center">
      {/* Background Subtle Radial Glow */}
      {/* Grid Pattern with Radial Fade Mask */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 50%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 50%, transparent 100%)"
        }}
      />

      {/* Background Subtle Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 blur-[120px] -z-10"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.35) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1440px] mx-auto w-full px-6 pt-10 pb-20 lg:pb-32 min-h-full flex flex-col lg:flex-row items-center justify-between gap-12  ">
        {/* Left vertical border line matching the Navbar */}
        <div className="absolute left-6 -top-[1px] bottom-0 w-px bg-zinc-800 pointer-events-none ml-[15px]" />

        {/* Right vertical border line matching the Navbar */}
        <div className="absolute right-6 -top-[1px] bottom-0 w-px bg-zinc-800 pointer-events-none  mr-[15px]" />

        <div className="flex-1 z-10 select-none ml-6 pt-0 pb-4 px-4">
          <div>
            {/* SaaS Version Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950/60 text-[11px] font-medium text-zinc-400 font-mono mb-6 hover:border-zinc-700 transition-colors cursor-default w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
              <span>Now in Public Beta</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-medium tracking-tight text-white font-sans leading-[1.1] mb-6">
              Next Generation
              <br />
              <span className="relative inline-block mt-2 text-white pb-1">
                Rate Limiting
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#F97316] pointer-events-none select-none"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 1 4 Q 25 1, 55 3 T 99 2"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    className="opacity-95"
                  />
                  <path
                    d="M 5 7 Q 35 4, 70 6 T 95 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    className="opacity-85"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-lg text-zinc-400 font-sans max-w-xl leading-relaxed">
              Drop-in SDK middleware. <span className="text-white font-semibold">Redis-powered.</span> <span className="text-white font-semibold">Sub-millisecond</span> decisions at any scale.
            </p>
          </div>

          <div className="flex gap-4 mt-8">

            <Link
              href="/dashboard"
              className="group relative inline-flex items-center justify-center border border-[#F97316] px-8 py-3 text-[15px] font-bold text-black font-mono overflow-hidden transition-colors duration-300 hover:border-white active:scale-[0.98] rounded-none"
            >
              {/* Default solid orange background layer */}
              <span className="absolute inset-0 bg-[#F97316] -z-20"></span>
              {/* Sliding white hover background layer */}
              <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out origin-left -z-10"></span>
              <span className="relative z-10 flex items-center gap-2">
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
              </span>
            </Link>

            <Link
              href="https://github.com/JejurkarYash/ratelimiter-microservice"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center border border-white px-8 py-3 text-[15px] font-bold text-white font-mono overflow-hidden transition-colors duration-300 hover:text-black active:scale-[0.98] rounded-none"
            >
              {/* Sliding white background */}
              <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out origin-left -z-10"></span>
              <span className="relative z-10 flex items-center gap-2">
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
              </span>
            </Link>
          </div>


        </div>

        {/* ── RIGHT PANEL: CODE INTERACTIVE CONTAINER ── */}
        <div className="w-full lg:flex-1 max-w-[580px] pr-[5px] mr-6 z-10 flex justify-center lg:justify-end">
          <TerminalLogCard />
        </div>
      </div>
    </section>
  );
}
