import { headers } from "next/headers";
import { auth } from "../../../../auth"; // adjust if needed

// General-purpose session + role check
export async function requireUser(options?: {
  roles?: string[];         // e.g. ["admin", "creator"]
  allowSuspended?: boolean; // default false
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized: No active session");
  }

  const { user } = session;

  if (!options?.allowSuspended && user.suspended) {
    throw new Error("Forbidden: Account suspended");
  }

  if (options?.roles && !options.roles.includes(user.role)) {
    throw new Error(`Forbidden: Requires role ${options.roles.join(" or ")}`);
  }

  return user;
}


// Shortcut for admin-only access
export async function requireAdmin() {
  return requireUser({ roles: ["admin"] });
}
