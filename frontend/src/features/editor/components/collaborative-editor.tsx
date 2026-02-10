"use client";

import { SimpleEditor } from "@/features/editor/components/tiptap-templates/simple/simple-editor";
import { useCreateEditor } from "@/features/editor/hooks/use-tiptap-editor";

interface CollaborativeEditorProps {
    projectId: string;
    initialContent?: any;
}

export function CollaborativeEditor({ projectId, initialContent }: CollaborativeEditorProps) {
    const editor = useCreateEditor({ initialContent });

    if (!editor) {
        return <div className="p-4 text-gray-500">Loading editor...</div>;
    }

    return (
        <div className="w-full h-full">
            <SimpleEditor
                editor={editor}
                documentId={projectId}
            />
        </div>
    );
}
