import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Call NestJS backend login endpoint
                    const response = await fetch("http://localhost:3001/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!response.ok) {
                        return null;
                    }

                    const data = await response.json();

                    // NestJS returns: { user: {...}, backendTokens: { accessToken: "..." } }
                    if (data.user && data.backendTokens?.accessToken) {
                        return {
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.name,
                            image: data.user.image,
                            accessToken: data.backendTokens.accessToken,
                        };
                    }

                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // When user signs in, append the accessToken from NestJS to the JWT
            if (user) {
                token.accessToken = user.accessToken;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Pass the accessToken and id to the session object
            if (session.user) {
                session.user.accessToken = token.accessToken as string;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
