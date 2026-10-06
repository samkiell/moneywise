import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { teamService } from "@/lib/services/team.service";
import { teamMemberSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;
    const json = await req.json();

    const validated = teamMemberSchema.partial().safeParse(json);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const updated = await teamService.update(id, validated.data);
    if (!updated) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;
    const success = await teamService.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
