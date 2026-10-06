import { NextResponse } from "next/server";
import { authErrorStatus, requirePermission } from "@/lib/auth/guards";
import { canSetStatus } from "@/lib/auth/permissions";
import { publicationService } from "@/lib/services/publication.service";
import { publicationSchema } from "@/lib/validations";
import { sanitizeContent } from "@/lib/sanitize";

export async function POST(req: Request) {
  try {
    const user = await requirePermission("publication:create");
    const json = await req.json();

    const validated = publicationSchema.safeParse(json);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = validated.data;

    if (!canSetStatus(user.role, data.status)) {
      return NextResponse.json(
        { error: "Forbidden: you cannot publish. Save as draft or submit for review." },
        { status: 403 }
      );
    }
    if (data.featured && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: only admins can feature." }, { status: 403 });
    }

    const created = await publicationService.create({
      ...data,
      content: sanitizeContent(data.content),
      publishedAt: data.status === "published" ? new Date() : null,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: authErrorStatus(message) });
  }
}
