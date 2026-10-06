"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IPublication, UserRole } from "@/types";
import { can } from "@/lib/auth/permissions";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface PublicationFormProps {
  initialData?: IPublication;
  isEditing?: boolean;
  role?: UserRole;
}

export function PublicationForm({ initialData, isEditing = false, role = "editor" }: PublicationFormProps) {
  const canPublish = can(role, "publication:publish");
  const canFeature = can(role, "publication:feature");
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    type: initialData?.type || "story",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "<p></p>",
    coverImage: initialData?.coverImage || "",
    author: initialData?.author || "",
    category: initialData?.category || "Financial Literacy",
    tags: initialData?.tags?.join(", ") || "",
    status: initialData?.status || "draft",
    featured: initialData?.featured || false,
    readingTime: initialData?.readingTime || 3,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const res = await fetch(
        isEditing ? `/api/publications/${initialData?._id}` : "/api/publications",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to save publication.");
      }

      router.push("/admin/publications");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-surface border border-neutral-border p-8 rounded-lg shadow-sm">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-neutral-main mb-1">Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Navigating Campus Budgeting in OAU"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-main mb-1">Slug</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. navigating-campus-budgeting"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-main mb-1">Publication Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as "story" | "tabloid" })}
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="story">Story (Creative / Narrative)</option>
            <option value="tabloid">Tabloid (Educational / Analysis)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-main mb-1">Category</label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Financial Literacy"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-main mb-1">Author</label>
          <input
            type="text"
            required
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. John Kolade Akande"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-main mb-1">Workflow Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "review" | "published" })}
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            {canPublish && <option value="published">Published</option>}
          </select>
        </div>
      </div>

      {/* Cover Image Upload via Cloudinary */}
      <div>
        <ImageUpload
          value={formData.coverImage}
          onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
          folder="moneywise/covers"
          label="Publication Cover Image"
          description="Upload an editorial header cover image (PNG, JPG, WebP up to 5MB)"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-main mb-1">Excerpt</label>
        <textarea
          rows={3}
          required
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-white border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Brief summary introducing the publication..."
        />
      </div>

      {/* Visual Tiptap Editor */}
      <div>
        <label className="block text-xs font-semibold text-neutral-main mb-1">Article Content</label>
        <TiptapEditor
          content={formData.content}
          onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
        />
      </div>

      {canFeature && (
        <div className="flex items-center gap-6 pt-4 border-t border-neutral-border">
          <label className="flex items-center gap-2 text-xs font-medium text-neutral-main cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded border-neutral-border text-primary focus:ring-primary"
            />
            Feature on Homepage
          </label>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-border">
        <button
          type="button"
          onClick={() => router.push("/admin/publications")}
          className="px-4 py-2 text-xs font-semibold text-neutral-secondary hover:text-neutral-main"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : isEditing ? "Update Publication" : "Create Publication"}
        </button>
      </div>
    </form>
  );
}
