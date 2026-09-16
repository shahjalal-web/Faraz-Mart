/**
 * Browser-side fetch helper for admin dashboard pages/forms. Always called
 * from "use client" components, so the session cookie is already in the
 * browser's jar — credentials:"include" is all that's needed (unlike
 * server-component reads, which have no cookie jar and forward it manually;
 * see app/admin/(dashboard)/page.tsx for that case).
 */
export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${baseUrl}${path}`, {
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error ?? `Request to ${path} failed with status ${response.status}`);
  }
  return data as T;
}
