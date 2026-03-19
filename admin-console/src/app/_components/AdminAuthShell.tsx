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
  message,
}: {
  message: string;
}) {
  return (
    <main className="temp-login-page temp-login-page--transition">
      <section
        className="temp-login-card temp-login-card--transition temp-login-card--spinner-only"
        aria-label="Loading admin session"
      >
        <div className="temp-login-spinner" aria-hidden="true" />
        <span className="temp-login-sr-only">{message}</span>
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
      setIsRedirecting(true);

      void auth.signOut().finally(() => {
        router.replace("/login");
      });
      return;
    }

    if (!user && !publicPath) {
      setIsRedirecting(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_next_path", pathname);
      }
      router.replace("/login");
      return;
    }

    if (user && pathname === "/login") {
      const storedPath =
        typeof window !== "undefined" ? sessionStorage.getItem("admin_next_path") : null;
      const nextPath = storedPath && storedPath.startsWith("/") ? storedPath : "/";

      setIsRedirecting(true);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("admin_next_path");
      }
      router.replace(nextPath);
      return;
    }

    setIsRedirecting(false);
  }, [authReady, pathname, router, user]);

  if (!authReady) {
    return (
      <AuthTransitionScreen
        message="Loading admin session."
      />
    );
  }

  if (isRedirecting) {
    return <AuthTransitionScreen message="Preparing your admin workspace." />;
  }

  return <>{children}</>;
}