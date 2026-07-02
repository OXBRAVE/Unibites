"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../login/login.module.css";

export default function StaffRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    restaurantName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/staff/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/staff/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={`card ${styles.authCard} animate-fade-in`}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <span style={{ backgroundColor: "rgba(79,70,229,0.1)", color: "var(--primary)", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.85rem", fontWeight: 600 }}>Staff Portal</span>
        </div>
        <h1 className={styles.title}>Restaurant Partner</h1>
        <p className={styles.subtitle}>Register your restaurant on UniBites</p>
        
        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="input-group">
            <label className="input-label" htmlFor="name">Manager Full Name</label>
            <input id="name" type="text" required className="input-field" value={formData.name} onChange={handleChange} placeholder="Jane Doe" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="restaurantName">Restaurant Name</label>
            <input id="restaurantName" type="text" required className="input-field" value={formData.restaurantName} onChange={handleChange} placeholder="The Dome" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Work Email</label>
            <input id="email" type="email" required className="input-field" value={formData.email} onChange={handleChange} placeholder="jane@thedome.edu" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input id="password" type="password" required className="input-field" value={formData.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
            {loading ? "Registering..." : "Create Restaurant Account"}
          </button>
        </form>
        <div className={styles.footerLink}>
          Already registered? <Link href="/staff/login">Log in here.</Link>
        </div>
        <div className={styles.footerLink} style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          Are you a student? <Link href="/register">Student Registration</Link>
        </div>
      </div>
    </div>
  );
}
