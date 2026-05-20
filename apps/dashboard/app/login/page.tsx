"use client";
import { useEffect } from "react";
import LoginShell from "@/components/auth/LoginShell";


export default function LoginPage() {
  useEffect(() => {
    document.body.classList.add("no-scroll");
    document.documentElement.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
    };
  }, []);

  return <LoginShell />;
}
