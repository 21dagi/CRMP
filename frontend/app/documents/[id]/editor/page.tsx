import Link from "next/link";
import { CollaborativeEditor } from "@/features/editor/components/collaborative-editor";

interface EditorPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
    const { id } = await params;

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
                        Project: {id}
                    </span>
                </div>
            </header>

            {/* Editor Workspace */}
            <main className="flex-1 flex justify-center p-6 md:p-10 overflow-hidden">
                <div className="w-full max-w-5xl h-full min-h-[850px] bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col">
                    <CollaborativeEditor projectId={id} />
                </div>
            </main>
        </div>
    );
}
