"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function CreateDocumentButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleCreate = async () => {
        if (!session?.user?.accessToken) {
            alert("You must be logged in to create a document.");
            return;
        }

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

        setLoading(true);
        console.log("Attempting to create document at:", `${backendUrl}/documents`);

        try {
            const response = await fetch(`${backendUrl}/documents`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.user.accessToken}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Backend error response:", errorText);
                throw new Error(`Failed to create document: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Document created successfully:", data);
            router.push(`/documents/${data.id}/editor`);
        } catch (error) {
            console.error("Fetch error details:", error);
            alert(`Failed to connect to backend. Please ensure the server is running at ${backendUrl}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCreate}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-zinc-50 hover:bg-blue-700 h-10 px-4 py-2"
        >
            {loading ? "Creating..." : "+ Create New"}
        </button>
    );
}
