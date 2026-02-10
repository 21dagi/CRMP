import Link from "next/link";
import { CollaborativeEditor } from "@/features/editor/components/collaborative-editor";
import { fetchWithAuth } from "@/lib/api";
import { notFound } from "next/navigation";

interface EditorPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
    const { id } = await params;

    let document = null;
    try {
        document = await fetchWithAuth(`/documents/${id}`);
    } catch (error: any) {
        console.error("Error fetching document:", error);
        // If the error message indicates unauthorized or not found
        if (error.message?.includes("404") || error.message?.includes("not found")) {
            return notFound();
        }
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg border border-red-200 dark:border-red-900 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You do not have permission to view this document or the server is unreachable.
                    </p>
                    <Link href="/dashboard" className="text-blue-600 hover:underline">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (!document) {
        return notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-zinc-950 font-sans">
            {/* Top Navigation */}
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                    <div className="h-4 w-px bg-gray-300 dark:bg-zinc-700"></div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {document.title}
                    </span>
                </div>
            </header>

            {/* Editor Workspace */}
            <main className="flex-1 flex justify-center p-6 md:p-10 overflow-hidden">
                <div className="w-full max-w-5xl h-full min-h-[850px] bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col">
                    <CollaborativeEditor projectId={id} initialContent={document.currentContent} />
                </div>
            </main>
        </div>
    );
}
