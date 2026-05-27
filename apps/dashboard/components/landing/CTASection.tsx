"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function CTASection() {
  const [copied, setCopied] = useState(false);
  const { status } = useSession();

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText("npm install @throttlr/sdk");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const avatars = [
    { initials: "AK", bg: "bg-[#1c1c1f]" },
    { initials: "MR", bg: "bg-[#27272a]" },
    { initials: "JS", bg: "bg-[#18181b]" },
    { initials: "PK", bg: "bg-[#1c1c1f]" },
    { initials: "TN", bg: "bg-[#27272a]" },
  ];

  return (
    <section className="w-full bg-[#0d0d0f] py-20 border-t border-zinc-900 select-none relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1440px] mx-auto px-6 relative"
      >
        <div className="absolute left-[9px] -top-20 -bottom-20 w-px bg-zinc-800 pointer-events-none ml-[15px] hidden md:block" />
        <div className="absolute right-[9px] -top-20 -bottom-20 w-px bg-zinc-800 pointer-events-none mr-[15px] hidden md:block" />

        <div className="max-w-[600px] w-full mx-auto flex flex-col items-center justify-center text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950/60 text-[11px] font-medium text-zinc-400 font-mono mb-6 hover:border-zinc-700 transition-colors cursor-default w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
            <span>Free to use · No credit card required</span>
          </div>

          <h2
            className="text-4xl sm:text-5xl lg:text-[56px] font-medium tracking-tight text-white font-sans leading-[1.1] mb-6"
            style={{ letterSpacing: "-0.04em" }}
          >
            Start protecting
            <br />
            your <span className="text-[#F97316]">API</span> today.
          </h2>

          <p className="text-lg text-zinc-400 font-sans max-w-xl leading-relaxed mb-8">
            Drop-in SDK middleware. Redis-powered. Deploy in minutes.
          </p>

          <div className="w-full max-w-md z-10 flex justify-center mb-8 font-mono">
            <div className="flex items-center justify-between bg-[#111113] border border-[#27272a] rounded-lg py-3 sm:py-3.5 px-4 sm:px-6 w-full select-text transition-all hover:border-[#ea580c]/50">
              <span className="text-[12px] sm:text-[14px] text-zinc-300">
                <span className="text-[#71717a]">npm install </span>
                <span className="text-[#ea580c] font-semibold">@throttlr/sdk</span>
              </span>

              <button
                onClick={handleCopy}
                className="text-[#52525b] hover:text-zinc-300 transition-colors ml-4 sm:ml-6 cursor-pointer shrink-0"
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto mb-10">
            <Link
              href={status == "authenticated" ? "/dashboard" : "/login"}
              className="group relative isolate inline-flex items-center justify-center border border-[#F97316] px-8 py-3 text-[15px] font-bold text-black font-mono overflow-hidden transition-colors duration-300 hover:border-white active:scale-[0.98] rounded-none w-full sm:w-auto text-center"
            >
              <span className="absolute inset-0 bg-[#F97316] -z-20"></span>
              <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out origin-left -z-10"></span>
              <span className="relative z-10 flex items-center justify-center gap-2 w-full">
                Get started free
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
              href={process.env.NEXT_PUBLIC_DOC_URL as string}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative isolate inline-flex items-center justify-center border border-white px-8 py-3 text-[15px] font-bold text-white font-mono overflow-hidden transition-colors duration-300 hover:text-black active:scale-[0.98] rounded-none w-full sm:w-auto text-center"
            >
              <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out origin-left -z-10"></span>
              <span className="relative z-10 flex items-center justify-center gap-2 w-full">
                View docs →
              </span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center -space-x-2 select-none shrink-0">
              {avatars.map((av, idx) => (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-full flex items-center justify-center border border-zinc-800 font-mono text-[9px] text-[#52525b] font-bold ${av.bg}`}
                >
                  {av.initials}
                </div>
              ))}
            </div>

            <span className="font-mono text-[11px] text-[#52525b] leading-relaxed text-center sm:text-left select-text">
              Join developers already protecting their APIs.
            </span>
          </div>
        </div>
      </motion.div>
    </section >
  );
}
