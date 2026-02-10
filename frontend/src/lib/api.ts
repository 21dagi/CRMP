import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Server-side fetch helper that automatically injects the NextAuth access token
 * from the session into the Authorization header.
 * 
 * @param url - The backend endpoint (e.g., "/documents")
 * @param options - Standard fetch options
 * @returns The JSON parsed response
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
        throw new Error("Unauthorized: No session or access token found. Please log in.");
    }

    const token = session.user.accessToken;
    const targetUrl = url.startsWith("http") ? url : `${BACKEND_URL}${url.startsWith("/") ? url : `/${url}`}`;

    const response = await fetch(targetUrl, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    // Handle common error cases
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Request failed with status ${response.status}`);
    }

    return response.json();
}
