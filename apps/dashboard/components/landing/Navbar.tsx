"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { status } = useSession();
  const buttonText = status === "authenticated" ? "Dashboard" : "Login";
  const buttonHref = status === "authenticated" ? "/dashboard" : "/login";


  console.log(process.env.NEXT_PUBLIC_DOC_URL)

  return (
    <header className="w-full border-b border-zinc-800 bg-[#09090b] sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between h-20 px-6 relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-800 pointer-events-none" />
        <div className="absolute right-6 top-0 bottom-0 w-px bg-zinc-800 pointer-events-none" />

        <div className="flex items-center pl-[5px] ml-4">
          <Link href="/" className="hover:opacity-90 transition-opacity flex items-center">
            <Image
              src="/logo.svg"
              alt="Throttlr"
              width={330}
              height={90}
              className="h-8 w-auto select-none pointer-events-none"
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-8 pr-[5px] mr-4">
          <Link
            href={process.env.NEXT_PUBLIC_DOC_URL as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] font-medium text-zinc-300 hover:text-white transition-colors font-mono"
          >
            Docs
          </Link>
          <Link
            href={buttonHref}
            className="group relative isolate inline-flex items-center justify-center border border-[#F97316] px-6 py-2 text-[14px] font-bold text-black font-mono overflow-hidden transition-colors duration-300 hover:border-white active:scale-[0.98] rounded-none hover:cursor-pointer"
          >
            <span className="absolute inset-0 bg-[#F97316] -z-20"></span>
            <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out origin-left -z-10"></span>
            <span className="relative z-10">{buttonText}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
