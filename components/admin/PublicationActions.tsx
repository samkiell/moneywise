"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Eye, EyeOff, Star, Trash2 } from "lucide-react";
import { can } from "@/lib/auth/permissions";
import type { PublicationStatus, UserRole } from "@/types";

interface PublicationActionsProps {
  id: string;
  title: string;
  status: PublicationStatus;
  featured: boolean;
  role: UserRole;
}

const btn =
  "inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded border border-neutral-border text-neutral-main hover:bg-slate-50 disabled:opacity-50 transition-colors";

/**
 * Row-level workflow controls: submit for review, publish/unpublish,
 * feature/unfeature, delete. Visibility mirrors lib/auth/permissions;
 * the API re-enforces everything server-side.
 */
export function PublicationActions({ id, title, status, featured, role }: PublicationActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function call(method: "PUT" | "DELETE", body?: Record<string, unknown>) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/publications/${id}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Action failed.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  }

  const canPublish = can(role, "publication:publish");
  const canFeature = can(role, "publication:feature");
  const canDelete = can(role, "publication:delete");
  const canSubmit = can(role, "publication:submit");

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {status === "draft" && canSubmit && (
        <button type="button" disabled={busy} className={btn} onClick={() => call("PUT", { status: "review" })}>
          <Send className="w-3 h-3" /> Submit for review
        </button>
      )}
      {status !== "published" && canPublish && (
        <button type="button" disabled={busy} className={btn} onClick={() => call("PUT", { status: "published" })}>
          <Eye className="w-3 h-3" /> Publish
        </button>
      )}
      {status === "published" && canPublish && (
        <button type="button" disabled={busy} className={btn} onClick={() => call("PUT", { status: "draft" })}>
          <EyeOff className="w-3 h-3" /> Unpublish
        </button>
      )}
      {status === "published" && canFeature && (
        <button
          type="button"
          disabled={busy}
          aria-pressed={featured}
          className={btn}
          onClick={() => call("PUT", { featured: !featured })}
        >
          <Star className={`w-3 h-3 ${featured ? "fill-current text-yellow-500" : ""}`} />
          {featured ? "Unfeature" : "Feature"}
        </button>
      )}
      {canDelete && (
        <button
          type="button"
          disabled={busy}
          className={`${btn} text-red-600`}
          onClick={() => {
            if (window.confirm(`Delete "${title}"? This cannot be undone.`)) void call("DELETE");
          }}
        >
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      )}
      {error && (
        <span role="alert" className="basis-full text-right text-[11px] text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
