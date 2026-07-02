"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../../login/login.module.css";

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      portal: "STAFF",
      redirect: false,
    });

    if (res?.error) {
      setError(res.error === "CredentialsSignin" ? "Invalid manager email or password" : res.error);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh(); 
    }
  };

  return (
    <>
      {registered && <div className={styles.successAlert}>Partner registration successful! Please log in to your dashboard.</div>}
      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="input-group">
          <label className="input-label" htmlFor="email">Work Email</label>
          <input
            id="email"
            type="email"
            required
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="manager@thedome.com"
          />
        </div>
        <div className="input-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label className="input-label" htmlFor="password">Password</label>
            <Link href="/forgot-password" className={styles.forgotPasswordLink}>
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
          {loading ? "Accessing Dashboard..." : "Login to Dashboard"}
        </button>
      </form>
    </>
  );
}

export default function StaffLoginPage() {
  return (
    <div className={styles.authContainer}>
      <div className={`card ${styles.authCard} animate-fade-in`}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <span style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "var(--secondary)", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.85rem", fontWeight: 600 }}>Restaurant Control Panel</span>
        </div>
        <h1 className={styles.title}>Staff Login</h1>
        <p className={styles.subtitle}>Manage your restaurant orders and menus</p>
        
        <Suspense fallback={<div>Loading dashboard access...</div>}>
          <StaffLoginForm />
        </Suspense>

        <div className={styles.footerLink}>
          Restaurant not registered yet? <Link href="/staff/register">Partner with us.</Link>
        </div>
        <div className={styles.footerLink} style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          Are you a student? <Link href="/login">Student Login</Link>
        </div>
      </div>
    </div>
  );
}
