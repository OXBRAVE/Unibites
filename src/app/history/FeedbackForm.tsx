"use client";

import React, { useState } from "react";

export default function FeedbackForm({ restaurantId, restaurantName }: { restaurantId: string; restaurantName: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, rating, comment }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      alert("Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <div style={{ color: "var(--secondary)", fontWeight: 500 }}>Thank you for your feedback for {restaurantName}!</div>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h4 style={{ margin: 0 }}>Leave Feedback for {restaurantName}</h4>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Rating:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input-field" style={{ padding: "0.4rem" }}>
          <option value={5}>⭐⭐⭐⭐⭐ (Excellent)</option>
          <option value={4}>⭐⭐⭐⭐ (Good)</option>
          <option value={3}>⭐⭐⭐ (Average)</option>
          <option value={2}>⭐⭐ (Poor)</option>
          <option value={1}>⭐ (Terrible)</option>
        </select>
      </div>
      <textarea
        className="input-field"
        placeholder="How was your meal?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
      />
      <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", padding: "0.5rem 1rem", fontSize: "0.9rem" }} disabled={loading}>
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
