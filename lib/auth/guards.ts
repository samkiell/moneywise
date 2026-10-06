import { auth } from "@/lib/auth";
import { can, Permission } from "@/lib/auth/permissions";
import { UserRole } from "@/types";

export interface AuthenticatedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: UserRole;
}

/**
 * Enforces session authentication in Server Components or Server Actions.
 * Throws an error or returns the user.
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: Authentication required.");
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role || "editor",
  };
}

/**
 * Enforces admin-only access.
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (user.role !== "admin") {
    throw new Error("Forbidden: Admin privileges required.");
  }

  return user;
}

/**
 * Enforces a specific permission from the central policy (lib/auth/permissions).
 */
export async function requirePermission(permission: Permission): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (!can(user.role, permission)) {
    throw new Error(`Forbidden: missing permission ${permission}.`);
  }

  return user;
}

/** Maps guard errors to HTTP status codes. */
export function authErrorStatus(message: string): number {
  if (message.startsWith("Unauthorized")) return 401;
  if (message.startsWith("Forbidden")) return 403;
  return 500;
}
