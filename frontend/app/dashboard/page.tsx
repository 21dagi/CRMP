import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserMenu } from "@/components/dashboard/user-menu";
import { CreateDocumentButton } from "@/components/dashboard/create-document-button";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    let documents = [];
    try {
        documents = await fetchWithAuth("/documents");
    } catch (error) {
        console.error("Error fetching documents:", error);
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                        CRMP
                    </div>
                </div>
                <UserMenu user={session.user} />
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        My Documents
                    </h1>
                    <CreateDocumentButton />
                </div>

                {/* Document Grid / Empty State */}
                {documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-lg border border-dashed border-gray-300 dark:border-zinc-800">
                        <div className="text-gray-400 mb-4 text-5xl">📄</div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            You have no documents
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Create your first research document to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc: any) => (
                            <div
                                key={doc.id}
                                className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                                        {doc.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Last edited: {new Date(doc.updatedAt).toLocaleDateString()}
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
                )}
            </main>
        </div>
    );
}
