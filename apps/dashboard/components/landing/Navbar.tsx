"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="w-full border-b border-zinc-800 bg-[#09090b] sticky top-0 z-50">
      {/* Central content container aligning with the grid lines */}
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between h-20 px-6 relative">
        {/* Left vertical border line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-800 pointer-events-none" />

        {/* Right vertical border line */}
        <div className="absolute right-6 top-0 bottom-0 w-px bg-zinc-800 pointer-events-none" />

        {/* Logo Section (padded exactly 5px to the right of the left vertical grid line) */}
        <div className="flex items-center m-4 p-4 ">
          <Link href="/" className="hover:opacity-90 transition-opacity flex items-center">
            <Image
              src="/logo.svg"
              alt="Throttlr"
              width={250}
              height={60}
              className="h-9 w-auto select-none pointer-events-none"
              priority
            />
          </Link>
        </div>

        {/* Nav Links & Call-to-Action Section (padded exactly 5px to the left of the right vertical grid line) */}
        <div className="flex items-center gap-8 pr-[5px] m-4 ">
          <Link
            href={process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:3002"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] font-medium text-zinc-300 hover:text-white transition-colors font-mono"
          >
            Docs
          </Link>
          <Link
            href="/dashboard"
            className="bg-[#F97316] text-white px-6 py-2 rounded-xl text-[15px] font-semibold hover:bg-[#ea580c] active:scale-[0.98] transition-all duration-200 font-mono shadow-[0_4px_20px_rgba(249,115,22,0.15)]"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
