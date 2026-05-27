"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import TerminalLogCard from "./TerminalLogCard";

export default function Hero() {
  return (
    <section className="relative w-full bg-[#09090b] border-b border-zinc-800 overflow-hidden min-h-[calc(100vh-80px)] flex items-center">
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

      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 blur-[120px] -z-10"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.35) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-6 pt-10 pb-20 lg:pb-32 min-h-full flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="absolute left-6 -top-[1px] bottom-0 w-px bg-zinc-800 pointer-events-none ml-[15px] hidden md:block" />
        <div className="absolute right-6 -top-[1px] bottom-0 w-px bg-zinc-800 pointer-events-none mr-[15px] hidden md:block" />

        <div className="flex-1 z-10 select-none ml-0 lg:ml-6 pt-0 pb-4 px-0 sm:px-4">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950/60 text-[11px] font-medium text-zinc-400 font-mono mb-6 hover:border-zinc-700 transition-colors cursor-default w-fit"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
              <span>Now in Public Beta</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-medium tracking-tight text-white font-sans leading-[1.1] mb-6"
            >
              Next Generation
              <br />
              <span className="relative inline-block mt-2 text-white pb-1">
                Rate Limiting
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#F97316] pointer-events-none select-none"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: "easeInOut" }}
                    d="M 1 4 Q 25 1, 55 3 T 99 2"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    className="opacity-95"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.85, ease: "easeInOut" }}
                    d="M 5 7 Q 35 4, 70 6 T 95 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    className="opacity-85"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg text-zinc-400 font-sans max-w-xl leading-relaxed"
            >
              Drop-in SDK middleware. <span className="text-white font-semibold">Redis-powered.</span> <span className="text-white font-semibold">Sub-millisecond</span> decisions at any scale.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto"
          >
            <Link
              href="/dashboard"
              className="group relative isolate inline-flex items-center justify-center border border-[#F97316] px-8 py-3 text-[15px] font-bold text-black font-mono overflow-hidden transition-colors duration-300 hover:border-white active:scale-[0.98] rounded-none w-full sm:w-auto text-center"
            >
              <span className="absolute inset-0 bg-[#F97316] -z-20"></span>
              <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out origin-left -z-10"></span>
              <span className="relative z-10 flex items-center justify-center gap-2 w-full">
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
              className="group relative isolate inline-flex items-center justify-center border border-white px-8 py-3 text-[15px] font-bold text-white font-mono overflow-hidden transition-colors duration-300 hover:text-black active:scale-[0.98] rounded-none w-full sm:w-auto text-center"
            >
              <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out origin-left -z-10"></span>
              <span className="relative z-10 flex items-center justify-center gap-2 w-full">
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
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:flex-1 max-w-[580px] pr-[5px] mr-0 lg:mr-6 z-10 flex justify-center lg:justify-end"
        >
          <TerminalLogCard />
        </motion.div>
      </div>
    </section>
  );
}
