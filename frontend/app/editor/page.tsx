"use client";

import { SimpleEditor } from "@/features/editor/components/tiptap-templates/simple/simple-editor";
import { useTiptapEditor } from "@/features/editor/hooks/use-tiptap-editor";

export default function EditorPage() {
    const dummyContent = "<p>Hello Tiptap</p>";

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 p-8 dark:bg-zinc-900">
            <div className="min-h-[800px] w-full max-w-[850px] rounded-xl bg-white shadow-lg dark:bg-zinc-800">
                <SimpleEditor content={dummyContent} />
            </div>
        </div>
    );
}
