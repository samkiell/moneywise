"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TiptapEditor({
  content,
  onChange,
  disabled = false,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline hover:text-brand-dark transition-colors",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full my-4 border border-neutral-border",
        },
      }),
    ],
    content,
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[260px] p-4 focus:outline-none text-sm text-neutral-main font-serif leading-relaxed",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync content when initialData or external prop updates cleanly
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter destination URL:", previousUrl);

    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }, [editor]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      setIsUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "moneywise/content");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to upload image.");
        }

        editor.chain().focus().setImage({ src: data.secureUrl }).run();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to upload image.");
      } finally {
        setIsUploadingImage(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="w-full border border-neutral-border rounded-lg bg-surface min-h-[300px] flex items-center justify-center text-xs text-neutral-secondary">
        Loading editor toolbar...
      </div>
    );
  }

  return (
    <div className="w-full border border-neutral-border rounded-lg bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
      {/* Visual Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-neutral-border text-neutral-main">
        {/* History */}
        <div className="flex items-center gap-0.5 pr-1 border-r border-neutral-border">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run() || disabled}
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded text-neutral-secondary hover:text-neutral-main hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run() || disabled}
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded text-neutral-secondary hover:text-neutral-main hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Text Formats */}
        <div className="flex items-center gap-0.5 px-1 border-r border-neutral-border">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run() || disabled}
            aria-label="Bold"
            title="Bold (Ctrl+B)"
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("bold")
                ? "bg-primary text-white"
                : "text-neutral-secondary hover:text-neutral-main hover:bg-white disabled:opacity-30"
            )}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run() || disabled}
            aria-label="Italic"
            title="Italic (Ctrl+I)"
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("italic")
                ? "bg-primary text-white"
                : "text-neutral-secondary hover:text-neutral-main hover:bg-white disabled:opacity-30"
            )}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run() || disabled}
            aria-label="Strikethrough"
            title="Strikethrough"
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("strike")
                ? "bg-primary text-white"
                : "text-neutral-secondary hover:text-neutral-main hover:bg-white disabled:opacity-30"
            )}
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Headings & Paragraph */}
        <div className="flex items-center gap-0.5 px-1 border-r border-neutral-border">
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            aria-label="Paragraph"
            title="Paragraph"
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("paragraph")
                ? "bg-primary text-white"
                : "text-neutral-secondary hover:text-neutral-main hover:bg-white"
            )}
          >
            <Pilcrow className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            aria-label="Heading 1"
            title="Heading 1"
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("heading", { level: 1 })
                ? "bg-primary text-white"
                : "text-neutral-secondary hover:text-neutral-main hover:bg-white"
            )}
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-label="Heading 2"
            title="Heading 2"
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("heading", { level: 2 })
                ? "bg-primary text-white"
                : "text-neutral-secondary hover:text-neutral-main hover:bg-white"
            )}
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            aria-label="Heading 3"
            title="Heading 3"
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("heading", { level: 3 })
                ? "bg-primary text-white"
                : "text-neutral-secondary hover:text-neutral-main hover:bg-white"
            )}
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 px-1 border-r border-neutral-border">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            aria-label="Bullet list"
            title="Bullet list"
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("bulletList")
                ? "bg-primary text-white"
                : "text-neutral-secondary hover:text-neutral-main hover:bg-white"
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            aria-label="Numbered list"
            title="Numbered list"
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("orderedList")
                ? "bg-primary text-white"
                : "text-neutral-secondary hover:text-neutral-main hover:bg-white"
            )}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            aria-label="Blockquote"
            title="Blockquote"
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("blockquote")
                ? "bg-primary text-white"
                : "text-neutral-secondary hover:text-neutral-main hover:bg-white"
            )}
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            aria-label="Horizontal rule"
            title="Horizontal divider"
            className="p-1.5 rounded text-neutral-secondary hover:text-neutral-main hover:bg-white"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Link & Media */}
        <div className="flex items-center gap-0.5 pl-1">
          <button
            type="button"
            onClick={setLink}
            aria-label="Add or edit link"
            title="Insert link"
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("link")
                ? "bg-primary text-white"
                : "text-neutral-secondary hover:text-neutral-main hover:bg-white"
            )}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          {editor.isActive("link") && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              aria-label="Remove link"
              title="Remove link"
              className="p-1.5 rounded text-neutral-secondary hover:text-red-600 hover:bg-white"
            >
              <Unlink className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingImage || disabled}
            aria-label="Upload image"
            title="Upload and insert image"
            className="p-1.5 rounded text-neutral-secondary hover:text-neutral-main hover:bg-white disabled:opacity-50"
          >
            {isUploadingImage ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/avif, image/gif"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} className="bg-white min-h-[260px]" />
    </div>
  );
}
