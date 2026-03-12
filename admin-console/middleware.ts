import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "temp_admin_auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get(AUTH_COOKIE)?.value === "1";
  const isLoginPage = pathname === "/login";

  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    const nextPath = `${pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isLoginPage) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
