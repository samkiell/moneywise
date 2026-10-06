import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { publicationService } from "@/lib/services/publication.service";
import { publicationSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    await requireAuth();
    const json = await req.json();

    const validated = publicationSchema.safeParse(json);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const created = await publicationService.create({
      ...validated.data,
      publishedAt: validated.data.status === "published" ? new Date() : null,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
