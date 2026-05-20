
export function convertToSeconds(unit: "second" | "minute" | "hour"): number {
    switch (unit) {
        case "second": return 1;
        case "minute": return 60;
        case "hour": return 3600;
    }
}


export function formatWindow(seconds: number): string {
    if (seconds >= 86400 && seconds % 86400 === 0) return `${seconds / 86400}d`;
    if (seconds >= 3600 && seconds % 3600 === 0) return `${seconds / 3600}h`;
    if (seconds >= 60 && seconds % 60 === 0) return `${seconds / 60}m`;
    return `${seconds}s`;
}
