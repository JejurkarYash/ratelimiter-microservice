"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { LogOut, User } from "lucide-react";

export default function UserAvatar() {
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (status === "loading") {
        return (
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 animate-pulse" />
        );
    }

    const user = session?.user;
    const name = user?.name ?? "User";
    const image = user?.image;
    // Get initials from name
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10 hover:ring-white/30 transition-all duration-200 cursor-pointer"
                title={name}
            >
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="w-full h-full flex items-center justify-center bg-primary/20 text-primary text-xs font-bold">
                        {initials}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-10 w-52 rounded-xl border border-white/10 bg-[#111113] shadow-xl shadow-black/40 z-50 overflow-hidden">
                    {/* User info */}
                    <div className="flex items-center gap-2.5 px-3 py-3 border-b border-white/[0.07]">
                        {image ? (
                            <Image
                                src={image}
                                alt={name}
                                width={28}
                                height={28}
                                className="rounded-full flex-shrink-0"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <User size={12} className="text-primary" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-[13px] font-medium text-white/90 truncate">{name}</p>
                            <p className="text-[11px] text-white/40 truncate">{user?.email}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-1">
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                            <LogOut size={14} />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
