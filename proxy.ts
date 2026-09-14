import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";

/**
 * First verification layer: gates admin PAGE navigation before anything
 * renders (Next.js 16 renamed `middleware.ts` to `proxy.ts` — same feature).
 * This alone is not enough — see `lib/auth/require-admin.ts`, which every
 * `/api/admin/**` route handler calls to re-verify the same JWT server-side
 * before touching any data, exactly per the two-layer check requested.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const payload = token ? await verifyAdminToken(token) : null;

  if (!payload) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
