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

export default function AdminAuthShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (nextUser && !isAllowedAdminEmail(nextUser.email)) {
        await auth.signOut();
        setUser(null);
        setAuthReady(true);
        if (!isPublicPath(pathname)) {
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        }
        return;
      }

      setUser(nextUser);
      setAuthReady(true);

      if (!nextUser && !isPublicPath(pathname)) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (nextUser && pathname === "/login") {
        router.replace("/");
      }
    });

    return unsubscribe;
  }, [pathname, router]);

  if (!authReady) {
    return (
      <main className="temp-login-page">
        <section className="temp-login-card" aria-label="Checking admin session">
          <p className="temp-login-kicker">PURENORWAY ADMIN</p>
          <h1>Checking session</h1>
          <p className="temp-login-help">Verifying Firebase login status.</p>
        </section>
      </main>
    );
  }

  if (!user && !isPublicPath(pathname)) {
    return null;
  }

  if (user && pathname === "/login") {
    return null;
  }

  return <>{children}</>;
}