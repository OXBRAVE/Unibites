"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

function LoginForm() {
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
      portal: "STUDENT",
      redirect: false,
    });

    if (res?.error) {
      setError(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
      setLoading(false);
    } else {
      const callbackUrl = searchParams.get("callbackUrl") || "/restaurants";
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <>
      {registered && <div className={styles.successAlert}>Registration successful! Please log in.</div>}
      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="input-group">
          <label className="input-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@uni.edu or admin@restaurant.com"
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
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.authContainer}>
      <div className={`card ${styles.authCard} animate-fade-in`}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to manage your orders</p>

        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className={styles.footerLink}>
          Don&apos;t have an account? <Link href="/register">Sign Up here.</Link>
        </div>
        <div className={styles.footerLink} style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          Restaurant staff? <Link href="/staff/login">Log in here</Link>
        </div>
      </div>
    </div>
  );
}
