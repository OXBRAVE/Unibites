"use client";

import { Feedback, Order } from "@prisma/client";

export default function AnalyticsView({ feedbacks, orders }: { feedbacks: Feedback[]; orders: Order[] }) {
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1) 
    : "No ratings yet";

  const totalRevenue = orders.reduce((acc, o) => acc + (o as any).totalAmount, 0).toFixed(2);
  const totalOrders = orders.length;

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: "1.5rem" }}>Analytics Overview</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "0.5rem" }}>Average Rating</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary)", lineHeight: 1 }}>{avgRating} {feedbacks.length > 0 && <span style={{fontSize:"1.5rem"}}>⭐</span>}</p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>Based on {feedbacks.length} reviews</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "0.5rem" }}>Total Orders</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1 }}>{totalOrders}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "0.5rem" }}>Total Revenue</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--secondary)", lineHeight: 1 }}>₦{totalRevenue}</p>
        </div>
      </div>

      <h2 style={{ marginBottom: "1.5rem" }}>Recent Feedback</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {feedbacks.length === 0 && <p className="card" style={{textAlign:"center", color: "var(--text-secondary)"}}>No feedback received yet.</p>}
        {feedbacks.map((f: any) => (
          <div key={f.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: 600 }}>{f.user?.name || "Student"}</span>
              <span>{"⭐".repeat(f.rating)}</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>&ldquo;{f.comment}&rdquo;</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              {new Date(f.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
