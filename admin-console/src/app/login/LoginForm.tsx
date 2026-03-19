"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInAdmin } from "@/lib/adminAuth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const requestedPath = url.searchParams.get("next");
    if (!requestedPath) return;

    if (requestedPath.startsWith("/")) {
      sessionStorage.setItem("admin_next_path", requestedPath);
    }

    url.searchParams.delete("next");
    const cleaned = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({}, "", cleaned || "/login");
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signInAdmin(email, password);

      const requestedPath =
        typeof window !== "undefined" ? sessionStorage.getItem("admin_next_path") : null;
      const nextPath = requestedPath && requestedPath.startsWith("/") ? requestedPath : "/";

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("admin_next_path");
      }

      router.replace(nextPath);
    } catch (nextError) {
      if (nextError instanceof Error) {
        setError(nextError.message || "Login failed. Try again.");
      } else {
        setError("Could not reach Firebase auth service.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="temp-login-form">
      <label htmlFor="tempEmail">Admin Email</label>
      <input
        id="tempEmail"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter admin email"
        autoComplete="email"
        required
      />

      <label htmlFor="tempPassword">Password</label>
      <input
        id="tempPassword"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter Firebase password"
        autoComplete="current-password"
        required
      />

      {error ? <p className="temp-login-error">{error}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
