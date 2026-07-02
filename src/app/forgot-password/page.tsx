"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./forgot-password.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Mock API call
    try {
      // In a real app, you'd call an API route here
      // const res = await fetch("/api/auth/forgot-password", { ... });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={`card ${styles.authCard} animate-fade-in`}>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.subtitle}>Enter your email to receive a password reset link</p>
        
        {success ? (
          <div className={styles.successAlert}>
            If an account exists for {email}, you will receive a password reset link shortly.
          </div>
        ) : (
          <>
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
                  placeholder="student@uni.edu"
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: "100%", marginTop: "1rem" }} 
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}

        <div className={styles.footerLink}>
          Remember your password? <Link href="/login">Sign In here.</Link>
        </div>
      </div>
    </div>
  );
}
