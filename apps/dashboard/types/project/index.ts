export interface Project {
    id: string;
    name: string;
    apiKeyMasked: string;
    isActive: boolean;
    rulesCount: number;
    requestsToday: number;
    blockedToday: number;
    lastActiveAt: string | null;
    createdAt: string;
}