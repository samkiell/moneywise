import { describe, it, expect } from "vitest";
import { can, canSetStatus, canEditPublication } from "@/lib/auth/permissions";

describe("Role and Permission Enforcement", () => {
  it("allows admin full permissions across all capabilities", () => {
    expect(can("admin", "publication:create")).toBe(true);
    expect(can("admin", "publication:publish")).toBe(true);
    expect(can("admin", "publication:feature")).toBe(true);
    expect(can("admin", "publication:delete")).toBe(true);
    expect(can("admin", "team:manage")).toBe(true);
  });

  it("restricts editor from publishing, featuring, or deleting", () => {
    expect(can("editor", "publication:create")).toBe(true);
    expect(can("editor", "publication:edit")).toBe(true);
    expect(can("editor", "publication:submit")).toBe(true);
    expect(can("editor", "publication:publish")).toBe(false);
    expect(can("editor", "publication:feature")).toBe(false);
    expect(can("editor", "publication:delete")).toBe(false);
    expect(can("editor", "team:manage")).toBe(false);
  });

  it("handles status transitions correctly by role", () => {
    expect(canSetStatus("admin", "published")).toBe(true);
    expect(canSetStatus("editor", "published")).toBe(false);
    expect(canSetStatus("editor", "review")).toBe(true);
    expect(canSetStatus("editor", "draft")).toBe(true);
  });

  it("prevents editors from editing live published articles directly", () => {
    expect(canEditPublication("admin", "published")).toBe(true);
    expect(canEditPublication("editor", "published")).toBe(false);
    expect(canEditPublication("editor", "draft")).toBe(true);
    expect(canEditPublication("editor", "review")).toBe(true);
  });
});
