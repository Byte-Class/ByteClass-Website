import { NextResponse, type NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { fromUnixTime, isBefore } from "date-fns";

import { AccessToken, T_AccessToken } from "@/core/types/validators";

// Protect routes under matcher
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;

  // if not token redirect home
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // verify integrity of payload
  const payload = decodeJwt(token);

  // once this guard clause is done, then we know the token has the right payload data
  if (!AccessToken.safeParse(payload).success) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const tokenData = payload as T_AccessToken;

  // Verify token expiration, and session
  if (isBefore(fromUnixTime(tokenData.exp), new Date())) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
