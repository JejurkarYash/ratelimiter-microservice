"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-[#09090b] select-none">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[1440px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between py-8 px-6 relative gap-4"
      >
        <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-850 pointer-events-none" />
        <div className="absolute right-6 top-0 bottom-0 w-px bg-zinc-850 pointer-events-none" />

        <div className="flex items-center gap-3 pl-[5px] ml-4 z-10">
          <Link href="/" className="font-sans font-semibold text-sm tracking-tight text-white hover:opacity-90 transition-opacity">
            Throttlr<span className="text-[#F97316]">.</span>
          </Link>
          <span className="text-zinc-800 font-mono text-[11px] select-none">|</span>
          <span className="font-mono text-[11px] text-zinc-500">
            © {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex items-center gap-6 pr-[5px] mr-4 font-mono text-[12px] z-10">
          <Link
            href="https://github.com/JejurkarYash/ratelimiter-microservice"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            GitHub
          </Link>
          <Link
            href={process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:3002"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            Docs
          </Link>
        </div>
      </motion.div>
    </footer>
  );
}
