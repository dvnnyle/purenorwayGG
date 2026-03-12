"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/temp-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(data?.message || "Login failed. Try again.");
        setIsSubmitting(false);
        return;
      }

      const requestedPath = searchParams.get("next");
      const nextPath = requestedPath && requestedPath.startsWith("/") ? requestedPath : "/";

      sessionStorage.setItem("temp_admin_session", "1");
      sessionStorage.setItem("temp_admin_last_path", nextPath);

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Could not reach login service.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="temp-login-page">
      <section className="temp-login-card" aria-label="Temporary admin login">
        <p className="temp-login-kicker">PURENORWAY ADMIN</p>
        <h1>Login</h1>
        <p className="temp-login-help">Use your username and password to continue.</p>

        <form onSubmit={handleSubmit} className="temp-login-form">
          <label htmlFor="tempUsername">Username</label>
          <input
            id="tempUsername"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter temporary username"
            autoComplete="username"
            required
          />

          <label htmlFor="tempPassword">Password</label>
          <input
            id="tempPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter temporary password"
            autoComplete="current-password"
            required
          />

          {error ? <p className="temp-login-error">{error}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
