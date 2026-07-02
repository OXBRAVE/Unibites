import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SuperAdminDashboard from "./SuperAdminDashboard";

export const revalidate = 0;

export default async function SuperAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/login");
  }

  const restaurants = await prisma.restaurant.findMany({
    include: {
      feedbacks: {
        include: { user: true },
        orderBy: { createdAt: "desc" }
      },
      _count: {
        select: { orders: true, menuItems: true }
      }
    }
  });

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Super Admin Dashboard</h1>
      <SuperAdminDashboard initialRestaurants={restaurants} />
    </div>
  );
}
