"use client";
import { useState } from "react";

export default function OrderList({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h2>Active Orders</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map(order => (
        <div key={order.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3>Order by {order.user?.name || "Unknown"}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{new Date(order.createdAt).toLocaleString()}</p>
            <div style={{ marginTop: "0.5rem" }}>
              {order.items.map((item: any) => (
                <div key={item.id} style={{ fontSize: "0.9rem" }}>
                  {item.quantity}x {item.menuItem?.name || "Deleted Item"}
                </div>
              ))}
            </div>
            <p style={{ fontWeight: 600, marginTop: "0.5rem" }}>Total: ₦{order.totalAmount.toFixed(2)}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Status</label>
            <select 
              className="input-field" 
              value={order.status} 
              onChange={(e) => updateStatus(order.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
