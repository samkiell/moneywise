import { NextResponse } from "next/server";
import { authErrorStatus, requirePermission } from "@/lib/auth/guards";
import { canEditPublication, canSetStatus } from "@/lib/auth/permissions";
import { publicationService } from "@/lib/services/publication.service";
import { publicationSchema } from "@/lib/validations";
import { sanitizeContent } from "@/lib/sanitize";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const user = await requirePermission("publication:edit");
    const { id } = await params;
    const json = await req.json();

    const validated = publicationSchema.partial().safeParse(json);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const current = await publicationService.getById(id);
    if (!current) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 });
    }

    const data = { ...validated.data };

    if (!canEditPublication(user.role, current.status)) {
      return NextResponse.json(
        { error: "Forbidden: published content can only be changed by an admin." },
        { status: 403 }
      );
    }
    if (data.status && data.status !== current.status && !canSetStatus(user.role, data.status)) {
      return NextResponse.json(
        { error: "Forbidden: you cannot publish. Submit for review instead." },
        { status: 403 }
      );
    }
    if (
      typeof data.featured === "boolean" &&
      data.featured !== current.featured &&
      user.role !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden: only admins can feature." }, { status: 403 });
    }

    if (typeof data.content === "string") {
      data.content = sanitizeContent(data.content);
    }

    const update: Record<string, unknown> = { ...data };
    if (data.status === "published" && !current.publishedAt) {
      update.publishedAt = new Date();
    }
    if (data.status && data.status !== "published") {
      // Unpublishing also removes it from featured placement.
      update.featured = false;
    }

    const updated = await publicationService.update(id, update);
    if (!updated) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: authErrorStatus(message) });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    await requirePermission("publication:delete");
    const { id } = await params;
    const success = await publicationService.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: authErrorStatus(message) });
  }
}
