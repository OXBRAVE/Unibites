import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import FeedbackForm from "@/app/history/FeedbackForm";

// Force dynamic fetch
export const revalidate = 0;

export default async function OrderHistoryPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Resolve searchParams promise
  const resolvedParams = await Promise.resolve(searchParams);

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      restaurant: true,
      items: {
        include: { menuItem: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-fade-in container" style={{ maxWidth: "800px" }}>
      {resolvedParams.success && (
        <div style={{ background: "rgba(16,185,129,0.1)", color: "var(--secondary)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "2rem", border: "1px solid rgba(16,185,129,0.2)" }}>
          <strong>Success!</strong> Your order has been placed successfully.
        </div>
      )}

      <h1 style={{ marginBottom: "2rem" }}>Order History</h1>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>You haven&apos;t placed any orders yet.</p>
          <Link href="/restaurants" className="btn btn-primary">Browse Restaurants</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <h2 style={{ fontSize: "1.2rem", marginBottom: "0.2rem" }}>
                    {order.restaurant.name}
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    Ordered on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ 
                    display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: "var(--radius-xl)", fontSize: "0.85rem", fontWeight: 600,
                    backgroundColor: order.status === "Completed" ? "rgba(16,185,129,0.1)" : order.status === "Pending" ? "rgba(245,158,11,0.1)" : "rgba(79,70,229,0.1)",
                    color: order.status === "Completed" ? "var(--secondary)" : order.status === "Pending" ? "#d97706" : "var(--primary)"
                  }}>
                    {order.status}
                  </span>
                  <div style={{ marginTop: "0.5rem", fontWeight: 700 }}>
                    ₦{order.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                    <span>{item.quantity}x {item.menuItem.name}</span>
                    <span>₦{(item.quantity * item.menuItem.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {order.status === "Completed" && (
                <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px dashed var(--border)" }}>
                  <FeedbackForm restaurantId={order.restaurantId} restaurantName={order.restaurant.name} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
