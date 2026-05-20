"use client";
import ProjectLists from "@/components/dashboard/ProjectLists";
import { useSession } from "next-auth/react";
import { useEffect } from "react";




export default function DashboardPage() {
    const { status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/login";
        }
    }, [status])

    return (
        <ProjectLists />
    );
}