import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  // proxy.ts already redirects unauthenticated requests before this ever
  // renders — this second check is what supplies the admin's name/role to
  // the header and is a deliberate belt-and-suspenders re-verification.
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const admin = token ? await verifyAdminToken(token) : null;

  if (!admin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader name={admin.name} role={admin.role} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
