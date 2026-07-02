import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export const revalidate = 0;

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN" || !session.user.restaurantName) {
    redirect("/");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { name: session.user.restaurantName },
    include: {
      menuItems: true,
      orders: {
        include: { items: { include: { menuItem: true } }, user: true },
        orderBy: { createdAt: "desc" }
      },
      feedbacks: {
        include: { user: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: "2rem" }}>Dashboard - {restaurant.name}</h1>
      <AdminDashboard restaurant={restaurant} />
    </div>
  );
}
