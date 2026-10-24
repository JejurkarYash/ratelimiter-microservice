import axios from "axios";
import { getSession } from "next-auth/react";

export const SLOW_REQUEST_EVENT = "throttlr:slow-request";
const SLOW_REQUEST_THRESHOLD_MS = 2000;
const requestStartTimes = new WeakMap<object, number>();

const notifySlowRequest = (durationMs: number) => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(
            new CustomEvent(SLOW_REQUEST_EVENT, {
                detail: { durationMs },
            }),
        );
    }
};

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

axiosClient.interceptors.request.use((config) => {
    requestStartTimes.set(config, Date.now());
    return config;
});

const reportSlowRequest = <T extends { config: object }>(response: T) => {
    const startedAt = requestStartTimes.get(response.config);
    if (startedAt !== undefined) {
        const durationMs = Date.now() - startedAt;
        if (durationMs >= SLOW_REQUEST_THRESHOLD_MS) {
            notifySlowRequest(durationMs);
        }
        requestStartTimes.delete(response.config);
    }
    return response;
};

axiosClient.interceptors.response.use(
    reportSlowRequest,
    (error) => {
        if (axios.isAxiosError(error) && error.config) {
            const startedAt = requestStartTimes.get(error.config);
            if (startedAt !== undefined) {
                const durationMs = Date.now() - startedAt;
                if (durationMs >= SLOW_REQUEST_THRESHOLD_MS) {
                    notifySlowRequest(durationMs);
                }
                requestStartTimes.delete(error.config);
            }
        }
        return Promise.reject(error);
    },
);

axiosClient.interceptors.request.use(async (config) => {
    const session = await getSession();
    const token = (session as { backendToken?: string } | null)?.backendToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosClient;