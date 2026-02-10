"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Editor, EditorContent, EditorContext } from "@tiptap/react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

// --- UI Primitives ---
import { Button } from "@/features/editor/components/tiptap-ui-primitive/button";
import { Spacer } from "@/features/editor/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/features/editor/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import "@/features/editor/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/features/editor/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/features/editor/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/features/editor/components/tiptap-node/list-node/list-node.scss";
import "@/features/editor/components/tiptap-node/image-node/image-node.scss";
import "@/features/editor/components/tiptap-node/heading-node/heading-node.scss";
import "@/features/editor/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/features/editor/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/features/editor/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/features/editor/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/features/editor/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/features/editor/components/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/features/editor/components/tiptap-ui/color-highlight-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/features/editor/components/tiptap-ui/link-popover";
import { MarkButton } from "@/features/editor/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/features/editor/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/features/editor/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/features/editor/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/features/editor/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/features/editor/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";

// --- Components ---
import { ThemeToggle } from "@/features/editor/components/tiptap-templates/simple/theme-toggle";

// --- Styles ---
import "@/features/editor/components/tiptap-templates/simple/simple-editor.scss";

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  onSave,
  isSaving,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
  onSave: () => void;
  isSaving: boolean;
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <Button
          data-style="ghost"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-3 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          ) : null}
          <span className={isSaving ? "text-blue-600 font-medium" : "font-medium"}>
            {isSaving ? "Saving..." : "Save Draft"}
          </span>
        </Button>
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

interface SimpleEditorProps {
  onEditorReady?: (editor: Editor) => void;
  editor: Editor;
  documentId: string;
}

export function SimpleEditor({ onEditorReady, editor, documentId }: SimpleEditorProps) {
  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  );
  const toolbarRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!editor || !session?.user?.accessToken) {
      if (!session) alert("Please log in to save your work.");
      return;
    }

    setIsSaving(true);
    try {
      const contentJson = editor.getJSON();
      const response = await fetch(`http://localhost:3001/documents/${documentId}/versions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          content: contentJson,
          name: "Manual Save",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save draft");
      }

      console.log("Document saved successfully");
      alert("Saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save draft. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  }, [editor, session, documentId]);

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                bottom: `calc(100% - ${height - rect.y}px)`,
              }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
              onSave={handleSave}
              isSaving={isSaving}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  );
}
