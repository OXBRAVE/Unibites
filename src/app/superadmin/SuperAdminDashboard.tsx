"use client";

import { useState } from "react";
import styles from "./superadmin.module.css";

export default function SuperAdminDashboard({ initialRestaurants }: { initialRestaurants: any[] }) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [loading, setLoading] = useState<string | null>(null);
  const [showRegForm, setShowRegForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const handleToggleFlag = async (restaurantId: string, currentFlagged: boolean) => {
    let flagMessage = "";
    if (!currentFlagged) {
      flagMessage = window.prompt("Enter a reason for flagging this restaurant:") || "Flagged for poor feedback.";
    }

    setLoading(restaurantId + "-flag");
    try {
      const res = await fetch(`/api/superadmin/restaurants/${restaurantId}/flag`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFlagged: !currentFlagged, flagMessage }),
      });

      if (res.ok) {
        const updated = await res.json();
        setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, ...updated } : r));
      } else {
        alert("Failed to update flag status.");
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setLoading(null);
    }
  };

  const handleToggleBan = async (restaurantId: string, currentBanned: boolean) => {
    const confirmMsg = currentBanned 
      ? "Are you sure you want to unban this restaurant?" 
      : "Are you sure you want to BAN this restaurant? It will be hidden from students.";
    
    if (!window.confirm(confirmMsg)) return;

    setLoading(restaurantId + "-ban");
    try {
      const res = await fetch(`/api/superadmin/restaurants/${restaurantId}/ban`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: !currentBanned }),
      });

      if (res.ok) {
        const updated = await res.json();
        setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, ...updated } : r));
      } else {
        alert("Failed to update ban status.");
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setLoading(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    try {
      const res = await fetch("/api/superadmin/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc }),
      });

      if (res.ok) {
        const created = await res.json();
        setRestaurants(prev => [...prev, { ...created, feedbacks: [], _count: { orders: 0, menuItems: 0 } }]);
        setNewName("");
        setNewDesc("");
        setShowRegForm(false);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to register restaurant");
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Manage all restaurants and oversight performance.</p>
        <button className="btn btn-primary" onClick={() => setShowRegForm(!showRegForm)}>
          {showRegForm ? "Close Form" : "Register New Restaurant"}
        </button>
      </div>

      {showRegForm && (
        <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Register New Restaurant</h3>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label className="input-label">Restaurant Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                required
                placeholder="e.g. Skyline Cafe"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea 
                className="input-field" 
                value={newDesc} 
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="e.g. Fresh pastries and coffee"
                rows={2}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={regLoading}>
              {regLoading ? "Registering..." : "Add Restaurant"}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gap: "2rem" }}>
        {restaurants.map(r => {
          const avgRating = r.feedbacks.length > 0
            ? (r.feedbacks.reduce((acc: number, f: any) => acc + f.rating, 0) / r.feedbacks.length).toFixed(1)
            : "N/A";

          return (
            <div key={r.id} className="card" style={{ 
              borderLeft: r.isBanned ? "8px solid #000" : r.isFlagged ? "8px solid var(--accent)" : "8px solid var(--secondary)",
              opacity: r.isBanned ? 0.7 : 1
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
                    {r.name} {r.isBanned && <span style={{ fontSize: '0.8rem', background: '#000', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', verticalAlign: 'middle', marginLeft: '0.5rem' }}>BANNED</span>}
                  </h2>
                  <p style={{ color: "var(--text-secondary)" }}>{r.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleToggleFlag(r.id, r.isFlagged)}
                    className={`btn ${r.isFlagged ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ background: r.isFlagged ? "var(--secondary)" : "var(--accent)", color: "white" }}
                    disabled={loading === r.id + "-flag" || loading === r.id + "-ban"}
                  >
                    {loading === r.id + "-flag" ? "Wait..." : r.isFlagged ? "Unflag" : "Flag"}
                  </button>
                  <button 
                    onClick={() => handleToggleBan(r.id, r.isBanned)}
                    className="btn"
                    style={{ background: r.isBanned ? "var(--success)" : "#000", color: "white" }}
                    disabled={loading === r.id + "-flag" || loading === r.id + "-ban"}
                  >
                    {loading === r.id + "-ban" ? "Wait..." : r.isBanned ? "Unban" : "Ban"}
                  </button>
                </div>
              </div>

              {(r.isFlagged || r.isBanned) && (
                <div style={{ 
                  background: r.isBanned ? "rgba(0,0,0,0.05)" : "rgba(244,63,94,0.1)", 
                  padding: "1rem", 
                  borderRadius: "var(--radius-md)", 
                  marginBottom: "1.5rem", 
                  border: r.isBanned ? "1px solid #000" : "1px solid var(--accent)" 
                }}>
                  <p style={{ fontWeight: 600, color: r.isBanned ? "#000" : "var(--accent)" }}>
                    {r.isBanned ? "🚫 BANNED STATUS:" : "🚩 FLAG NOTICE:"}
                  </p>
                  <p>{r.isBanned ? "This restaurant is currently hidden from all students." : r.flagMessage}</p>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                <div className="card" style={{ textAlign: "center", padding: "1rem" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>{avgRating} ⭐</span>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Avg. Rating</p>
                </div>
                <div className="card" style={{ textAlign: "center", padding: "1rem" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>{r._count.orders}</span>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Orders</p>
                </div>
                <div className="card" style={{ textAlign: "center", padding: "1rem" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>{r._count.menuItems}</span>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Menu Items</p>
                </div>
              </div>

              {r.feedbacks.length > 0 && (
                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>Customer Feedback</h3>
                  <div style={{ maxHeight: "250px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {r.feedbacks.map((f: any) => (
                      <div key={f.id} style={{ 
                        fontSize: "0.9rem", 
                        color: "var(--text-primary)", 
                        background: 'white', 
                        padding: '1rem', 
                        borderRadius: 'var(--radius-sm)',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600 }}>{f.user?.name || "Student"}</span>
                          <span style={{ color: 'var(--accent)' }}>{"★".repeat(f.rating)}{"☆".repeat(5-f.rating)}</span>
                        </div>
                        <p style={{ fontStyle: "italic", color: 'var(--text-secondary)' }}>"{f.comment}"</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.5rem' }}>{new Date(f.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
