import axios from "axios";
import { getSession } from "next-auth/react";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

axiosClient.interceptors.request.use(async (config) => {
    const session = await getSession();
    const token = (session as any)?.backendToken;
    console.log("token: ", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosClient;