"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { isAllowedAdminEmail } from "@/lib/adminAuth";

const PUBLIC_PATHS = new Set(["/login"]);

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.has(pathname);
}

function AuthTransitionScreen({
  eyebrow,
  title,
  message,
}: {
  eyebrow: string;
  title: string;
  message: string;
}) {
  return (
    <main className="temp-login-page temp-login-page--transition">
      <section className="temp-login-card temp-login-card--transition" aria-label={title}>
        <div className="temp-login-spinner" aria-hidden="true" />
        <p className="temp-login-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="temp-login-help">{message}</p>
      </section>
    </main>
  );
}

export default function AdminAuthShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState({
    eyebrow: "PURENORWAY ADMIN",
    title: "Checking session",
    message: "Verifying Firebase login status.",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    const publicPath = isPublicPath(pathname);

    if (user && !isAllowedAdminEmail(user.email)) {
      setTransitionMessage({
        eyebrow: "ACCESS CHECK",
        title: "Signing out",
        message: "This account is not allowed to use the admin console.",
      });
      setIsRedirecting(true);

      void auth.signOut().finally(() => {
        router.replace("/login");
      });
      return;
    }

    if (!user && !publicPath) {
      setTransitionMessage({
        eyebrow: "SESSION EXPIRED",
        title: "Returning to login",
        message: "Your admin session is not active right now.",
      });
      setIsRedirecting(true);
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user && pathname === "/login") {
      const requestedPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null;
      const nextPath = requestedPath && requestedPath.startsWith("/") ? requestedPath : "/";

      setTransitionMessage({
        eyebrow: "ACCESS GRANTED",
        title: "Opening dashboard",
        message: "Your Firebase session is active. Loading admin tools now.",
      });
      setIsRedirecting(true);
      router.replace(nextPath);
      return;
    }

    setIsRedirecting(false);
  }, [authReady, pathname, router, user]);

  if (!authReady) {
    return (
      <AuthTransitionScreen
        eyebrow="PURENORWAY ADMIN"
        title="Checking session"
        message="Verifying Firebase login status."
      />
    );
  }

  if (isRedirecting) {
    return (
      <AuthTransitionScreen
        eyebrow={transitionMessage.eyebrow}
        title={transitionMessage.title}
        message={transitionMessage.message}
      />
    );
  }

  return <>{children}</>;
}