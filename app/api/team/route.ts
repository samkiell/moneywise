import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { teamService } from "@/lib/services/team.service";
import { teamMemberSchema } from "@/lib/validations";

export async function GET() {
  try {
    const members = await teamService.getAllMembers();
    return NextResponse.json(members);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth();
    const json = await req.json();

    const validated = teamMemberSchema.safeParse(json);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const created = await teamService.create(validated.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
