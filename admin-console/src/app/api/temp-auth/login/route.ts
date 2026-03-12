import { NextResponse } from "next/server";

const AUTH_COOKIE = "temp_admin_auth";

export async function POST(request: Request) {
  const expectedUsername = process.env.TEMP_ADMIN_USERNAME;
  const expectedPassword = process.env.TEMP_ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json(
      { ok: false, message: "Temporary credentials are not configured." },
      { status: 500 }
    );
  }

  let payload: { username?: string; password?: string } = {};

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const username = (payload.username ?? "").trim();
  const password = payload.password ?? "";

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json(
      { ok: false, message: "Invalid username or password." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: AUTH_COOKIE,
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
