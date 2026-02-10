"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserMenuProps {
    user: {
        name?: string | null;
        email?: string | null;
    };
}

export function UserMenu({ user }: UserMenuProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    const userInitials = user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U";

    return (
        <div className="flex items-center gap-4 relative">
            <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
            </span>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-sm font-medium text-white cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
                {userInitials}
            </button>
            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 top-12 w-48 bg-white dark:bg-zinc-800 rounded-md shadow-lg border border-gray-200 dark:border-zinc-700 py-1 z-20">
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-zinc-700">
                            <div className="font-medium truncate">{user?.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
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
                </>
            )}
        </div>
    );
}
