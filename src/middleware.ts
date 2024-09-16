import { NextResponse, type NextRequest } from "next/server";
import { decodeJwt } from "jose";

import { AccessToken } from "@/core/types/validators";

// Protect routes under matcher
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;

  // if not token redirect home
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // verify integrity of payload
  const payload = decodeJwt(token);

  if (!AccessToken.safeParse(payload).success) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!payload.token) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
