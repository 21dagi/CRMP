"use client";

import { SimpleEditor } from "@/features/editor/components/tiptap-templates/simple/simple-editor";

interface CollaborativeEditorProps {
    projectId: string;
}

export function CollaborativeEditor({ projectId }: CollaborativeEditorProps) {
    // Placeholder for future collaborative logic using projectId
    console.log("Initializing CollaborativeEditor for project:", projectId);

    return (
        <div className="w-full h-full">
            <SimpleEditor content="<p>Start collaborating...</p>" />
        </div>
    );
}
