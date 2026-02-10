"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MOCK_DOCUMENTS = [
    { id: "1", title: "Project Proposal", date: "2023-10-01" },
    { id: "2", title: "Budget Draft", date: "2023-10-05" },
];

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/auth/signin");
        }
    }, [isAuthenticated, isLoading, router]);

    const handleCreateNew = () => {
        console.log("Create new clicked");
    };

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const userInitials = user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                        CRMP
                    </div>
                </div>
                <div className="flex items-center gap-4 relative">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {user?.email}
                    </span>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-sm font-medium text-white cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    >
                        {userInitials}
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-zinc-800 rounded-md shadow-lg border border-gray-200 dark:border-zinc-700 py-1 z-10">
                            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-zinc-700">
                                <div className="font-medium">{user?.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.email}
                                </div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-700"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        My Documents
                    </h1>
                    <button
                        onClick={handleCreateNew}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        + Create New
                    </button>
                </div>

                {/* Document Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_DOCUMENTS.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {doc.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Last edited: {doc.date}
                                </p>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Link
                                    href={`/documents/${doc.id}/editor`}
                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                                >
                                    Open →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
