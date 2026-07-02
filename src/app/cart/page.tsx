"use client";

import { useCart } from "@/components/CartProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const { items, getTotal, clearCart, addItem, decreaseItem, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, totalAmount: getTotal() }),
      });

      if (res.ok) {
        clearCart();
        router.push("/history?success=true");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to place order.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="animate-fade-in container" style={{ maxWidth: "800px", textAlign: "center", paddingTop: "4rem" }}>
        <h1 style={{ marginBottom: "1rem" }}>Your Cart is Empty</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Looks like you haven&apos;t added anything yet.</p>
        <Link href="/restaurants" className="btn btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in container" style={{ maxWidth: "800px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Your Cart</h1>
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Ordering from: {items[0].restaurantName}</h2>
        </div>
        
        {error && <div style={{ color: "var(--accent)", marginBottom: "1rem", padding: "1rem", background: "rgba(244,63,94,0.1)", borderRadius: "var(--radius-md)" }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.2rem" }}>{item.name}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>₦{item.price.toFixed(2)}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <button onClick={() => decreaseItem(item.id)} className="btn btn-secondary" style={{ padding: '0.2rem 0.6rem', minWidth: '35px' }}>-</button>
                  <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => addItem(item)} className="btn btn-secondary" style={{ padding: '0.2rem 0.6rem', minWidth: '35px' }}>+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="btn" style={{ color: "var(--accent)", padding: "0.5rem", background: "transparent" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>Total</span>
          <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>₦{getTotal().toFixed(2)}</span>
        </div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
        <button onClick={clearCart} className="btn btn-secondary" style={{ flex: "1 1 auto" }}>Clear Cart</button>
        <button onClick={handleCheckout} className="btn btn-primary" disabled={loading} style={{ flex: "1 1 auto" }}>
          {loading ? "Processing..." : "Confirm & Place Order"}
        </button>
      </div>
    </div>
  );
}
