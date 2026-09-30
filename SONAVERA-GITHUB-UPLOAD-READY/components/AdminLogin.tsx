"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) setError(data.error || "Login failed.");
    else router.refresh();
    setLoading(false);
  }

  return (
    <main className="checkout admin-page">
      <section className="panel admin-login">
        <span className="eyebrow">SONAVERA</span>
        <h1>Admin Login</h1>
        <p className="muted">Private dashboard for your store and Razorpay orders.</p>
        <form onSubmit={login}>
          <div className="field"><label htmlFor="admin-password">Admin password</label><input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></div>
          {error && <div className="notice">{error}</div>}
          <button className="btn gold full" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        </form>
      </section>
    </main>
  );
}
