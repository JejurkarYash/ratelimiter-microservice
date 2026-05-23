"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";




const features = [
  {
    icon: "⚡",
    title: "Edge-fast rate limiting",
    desc: "Sub-millisecond decisions powered by Redis at the edge.",
  },
  {
    icon: "🔑",
    title: "API key management",
    desc: "Scope, rotate, and revoke keys with zero downtime.",
  },
  {
    icon: "📊",
    title: "Real-time analytics",
    desc: "Live dashboards for request volume, rejections, and latency.",
  },
];

export default function LoginShell() {

  const handleGoogleLogin = () => {
    signIn("google",
      {
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      }
    )
  };
  return (
    <div className="h-screen w-screen bg-[#09090b] text-white flex overflow-hidden">
      {/* ── LEFT PANEL ── */}
      <section className="relative w-full lg:w-[44%] flex flex-col px-10 py-8 border-r border-white/10 bg-[#09090b]">
        {/* Logo & Docs Link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight text-white">
              Throttlr<span className="text-primary">.</span>
            </h1>
          </div>
          <a
            href={process.env.NEXT_PUBLIC_DOCS_URL || process.env.NEXT_PUBLIC_DOC_URL || "http://localhost:3002"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium text-white/50 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5"
          >
            <span>Docs</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col flex-1 justify-center max-w-[320px] mx-auto w-full">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-medium tracking-tight mb-2 text-white">
              Welcome to Throttlr
            </h1>
            <p className="text-[14px] text-white/50">
              Log in or sign up to continue.
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full h-10 flex items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-transparent hover:bg-white/[0.03] transition-colors text-[14px] font-medium text-white hover:cursor-pointer "
          >
            <Image
              src="/google-icon.svg"
              alt="Google"
              width={16}
              height={16}
              className="flex-shrink-0"
            />
            Continue with Google
          </button>

          {/* Help Links */}
          <p className="text-[13px] text-white/40 mt-8 text-center">
            Need help?{" "}
            <a
              href={process.env.NEXT_PUBLIC_DOCS_URL || process.env.NEXT_PUBLIC_DOC_URL || "http://localhost:3002"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline transition-colors"
            >
              Read docs
            </a>{" "}
            or contact support.
          </p>
        </div>

        {/* Bottom footnote */}
        <div className="relative z-10 mt-auto">
          <p className="text-[13px] text-white/30">
            &copy; {new Date().getFullYear()} Throttlr.
          </p>
        </div>
      </section>

      {/* ── RIGHT PANEL (Video) ── */}
      <section className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-black">
        <video
          src="/video/signup-animation.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-90"
        />
      </section>

      {/* ── PREVIOUS RIGHT PANEL ── */}
      {false && (
        <section className="hidden lg:flex flex-1 relative bg-[#070708] flex-col items-center justify-center px-16 py-12 overflow-hidden">
          {/* Background grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Orange glow center */}
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)",
            }}
          />

          {/* Floating stats card */}
          <div className="relative z-10 w-full max-w-md space-y-4 mb-10">
            <StatsCard
              label="Requests processed"
              value="2.4B+"
              change="+18% this week"
              positive
            />
            <div className="grid grid-cols-2 gap-4">
              <StatsCard label="Avg latency" value="0.8ms" change="P99 · 2.1ms" />
              <StatsCard label="Uptime" value="99.99%" change="Last 90 days" />
            </div>
          </div>

          {/* Feature list */}
          <div className="relative z-10 w-full max-w-md space-y-3">
            {features.map((f) => (
              <FeatureRow key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function StatsCard({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-4 backdrop-blur-sm">
      <p className="text-[11px] text-white/35 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
      <p
        className={`text-[11px] mt-1 font-medium ${positive ? "text-emerald-400/80" : "text-white/30"
          }`}
      >
        {positive && "↑ "}
        {change}
      </p>
    </div>
  );
}

function FeatureRow({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 hover:bg-white/[0.04] transition-colors duration-200">
      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-[13px] font-semibold text-white/90 mb-0.5">{title}</p>
        <p className="text-[12px] text-white/35 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
