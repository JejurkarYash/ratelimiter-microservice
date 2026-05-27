import NextAuth from "next-auth"
import GoogeleProvider from "next-auth/providers/google"
import axiosClient from "@/services/axios";
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogeleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                token.accessToken = account.access_token

                try {
                    const response = await axiosClient.post("/auth/google-login", {
                        name: user.name || 'Google User',
                        email: user.email,
                        password: account.providerAccountId,
                    })
                    console.log("response: ", response.data)
                    if (response.data.token) {
                        token.backendToken = response.data.token
                    } else {
                        console.error("Backend auth failed:", response)
                    }
                } catch (error) {
                    console.error("Error connecting to backend auth:", error)
                }
            }
            return token
        },
        async session({ session, token }) {
            if (token && token.backendToken) {
                console.log("token: ", token.backendToken);
                (session as any).backendToken = token.backendToken;
            }
            return session;
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }