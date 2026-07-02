"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../login/login.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    hallOfResid: "",
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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/login?registered=true");
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
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join UniBites to start ordering</p>
        
        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="input-group">
            <label className="input-label" htmlFor="name">Full Name</label>
            <input id="name" type="text" required className="input-field" value={formData.name} onChange={handleChange} placeholder="John Doe" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="studentId">Student ID</label>
            <input id="studentId" type="text" required className="input-field" value={formData.studentId} onChange={handleChange} placeholder="e.g. 1900123" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input id="email" type="email" required className="input-field" value={formData.email} onChange={handleChange} placeholder="john@uni.edu" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="hallOfResid">Hall of Residence</label>
            <input id="hallOfResid" type="text" className="input-field" value={formData.hallOfResid} onChange={handleChange} placeholder="e.g. Block C" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input id="password" type="password" required className="input-field" value={formData.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
        <div className={styles.footerLink}>
          Already have an account? <Link href="/login">Log in here.</Link>
        </div>
        <div className={styles.footerLink} style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          Restaurant owner? <Link href="/staff/register">Partner with us</Link>
        </div>
      </div>
    </div>
  );
}
