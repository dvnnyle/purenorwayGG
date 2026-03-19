import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth } from "./firebase";

function parseAllowedAdminEmails(rawValue: string | undefined) {
  return (rawValue ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

const allowedAdminEmails = parseAllowedAdminEmails(process.env.NEXT_PUBLIC_ADMIN_EMAILS);

export function isAllowedAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  if (allowedAdminEmails.length === 0) {
    return true;
  }

  return allowedAdminEmails.includes(email.trim().toLowerCase());
}

export async function signInAdmin(email: string, password: string) {
  await setPersistence(auth, browserSessionPersistence);
  const credentials = await signInWithEmailAndPassword(auth, email, password);

  if (!isAllowedAdminEmail(credentials.user.email)) {
    await signOut(auth);
    throw new Error("This account does not have admin access.");
  }

  return credentials.user;
}

export async function signOutAdmin() {
  await signOut(auth);
}

export function getAdminDisplayName(user: User | null) {
  if (!user) {
    return {
      initials: "AD",
      name: "Admin User",
      role: "",
    };
  }

  const source = user.displayName?.trim() || user.email?.trim() || "Admin User";
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  const initials = parts.length >= 2
    ? `${parts[0][0] ?? "A"}${parts[1][0] ?? "D"}`.toUpperCase()
    : source.slice(0, 2).toUpperCase();

  return {
    initials: initials || "AD",
    name: user.displayName?.trim() || user.email || "Admin User",
    role: "",
  };
}