import { cookies } from "next/headers";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const password = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const authenticated = isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value, password);
  return authenticated ? <AdminDashboard /> : <AdminLogin />;
}
