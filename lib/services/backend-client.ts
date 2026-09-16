/**
 * Thin fetch wrapper the service layer uses to reach the separate Express
 * backend (back-end/) for data that now lives in MongoDB instead of a
 * static mock array. `cache: "no-store"` because products/categories/orders
 * are admin-editable now — a stale cached read would hide real changes.
 */
export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request to ${path} failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
