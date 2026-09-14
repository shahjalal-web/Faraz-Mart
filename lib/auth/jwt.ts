import { jwtVerify } from "jose";

export const ADMIN_SESSION_COOKIE = "faraz_admin_session";

export const ADMIN_ROLES = [
  "super-admin",
  "admin",
  "manager",
  "order-manager",
  "product-manager",
  "support-agent",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export interface AdminTokenPayload {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set. Add it to .env.local before using admin auth.");
  }
  return new TextEncoder().encode(secret);
}

/**
 * The frontend's page-navigation gate (proxy.ts) and the admin dashboard
 * layout both call this to verify the JWT the backend issued — no network
 * call to the backend needed, since a JWT's signature is self-verifying as
 * long as both sides share JWT_SECRET. This is the "check once on the
 * frontend" layer; the backend independently re-verifies the same token on
 * every actual data request via its own requireAdmin() middleware.
 */
export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      typeof payload.name === "string" &&
      typeof payload.role === "string"
    ) {
      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role as AdminRole,
      };
    }
    return null;
  } catch {
    return null;
  }
}
