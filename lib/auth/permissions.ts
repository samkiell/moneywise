import type { PublicationStatus, UserRole } from "@/types";

/**
 * Single source of truth for role permissions (PRD §9).
 *
 * Policy:
 *  - admin  : everything.
 *  - editor : create/edit publications and submit them for review.
 *             Cannot publish, unpublish, feature, delete, edit already-published
 *             content, or manage the team.
 */
export type Permission =
  | "publication:create"
  | "publication:edit"
  | "publication:submit"
  | "publication:publish"
  | "publication:feature"
  | "publication:delete"
  | "team:manage";

const ROLE_PERMISSIONS: Record<UserRole, ReadonlySet<Permission>> = {
  admin: new Set<Permission>([
    "publication:create",
    "publication:edit",
    "publication:submit",
    "publication:publish",
    "publication:feature",
    "publication:delete",
    "team:manage",
  ]),
  editor: new Set<Permission>([
    "publication:create",
    "publication:edit",
    "publication:submit",
  ]),
};

export function can(role: UserRole | undefined, permission: Permission): boolean {
  return !!role && ROLE_PERMISSIONS[role]?.has(permission) === true;
}

/** Can this role move a publication into the given status? */
export function canSetStatus(role: UserRole | undefined, status: PublicationStatus): boolean {
  if (status === "published") return can(role, "publication:publish");
  return can(role, "publication:submit");
}

/** Editors may not touch live content; admins may. */
export function canEditPublication(role: UserRole | undefined, current: PublicationStatus): boolean {
  if (current === "published") return can(role, "publication:publish");
  return can(role, "publication:edit");
}
