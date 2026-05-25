import Link from "next/link";
import React from "react";

interface Button1Props {
  href: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  className?: string;
}

export const Component: React.FC<Button1Props> = ({
  href,
  children,
  target,
  rel,
  className = "",
}) => {
  const isExternal = href.startsWith("http");

  // Keep button simple: bg remains solid zinc-950, and scales up on hover
  const buttonClasses = "relative inline-flex items-center justify-center text-base rounded-md bg-zinc-950 px-8 py-2.5 font-mono font-semibold text-white transition-all duration-200 group-hover:scale-[1.04] active:scale-[0.98]";

  return (
    <div className={`relative inline-flex items-center justify-center group ${className}`}>
      {/* Glow background uses -inset-4 to expand boundaries beyond the parent wrapper, preventing square edge clipping */}
      <div className="absolute -inset-4 duration-500 opacity-50 scale-100 transition-all bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 rounded-md blur-xl group-hover:opacity-100 group-hover:scale-110 group-hover:duration-200 group-hover:blur-2xl"></div>

      {isExternal ? (
        <a
          href={href}
          target={target}
          rel={rel}
          className={buttonClasses}
          title="payment"
        >
          {children}
          <svg
            viewBox="0 0 10 10"
            height="10"
            width="10"
            fill="none"
            className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
          >
            <path
              d="M0 5h7"
              className="transition opacity-0 group-hover:opacity-100"
            />
            <path
              d="M1 1l4 4-4 4"
              className="transition group-hover:translate-x-[3px]"
            />
          </svg>
        </a>
      ) : (
        <Link
          href={href}
          className={buttonClasses}
        >
          {children}
          <svg
            viewBox="0 0 10 10"
            height="10"
            width="10"
            fill="none"
            className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
          >
            <path
              d="M0 5h7"
              className="transition opacity-0 group-hover:opacity-100"
            />
            <path
              d="M1 1l4 4-4 4"
              className="transition group-hover:translate-x-[3px]"
            />
          </svg>
        </Link>
      )}
    </div>
  );
};
