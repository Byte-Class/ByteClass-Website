import { NextRequest, NextResponse } from "next/server";
import { errors, jwtVerify } from "jose";

import { validateMiddlewareTokens } from "@/core/types/validators";
import { CONFIG } from "@/core/data/config";

// auth a request on dashboard
export const authorise = async (req: NextRequest) => {
  let refresh = false;

  const tokens = {
    accessToken: req.cookies.get("accessToken")?.value,
    refreshToken: req.cookies.get("refreshToken")?.value,
  };

  // verify tokens
  const verifiedTokens = validateMiddlewareTokens.safeParse(tokens);
  if (!verifiedTokens.success) {
    return NextResponse.redirect(new URL(CONFIG.pages.home, req.url));
  }

  // validate access token
  try {
    await jwtVerify(
      verifiedTokens.data.accessToken,
      new TextEncoder().encode(CONFIG.jwt.accessTokenSecret),
    );
  } catch (err) {
    // if the access token error === expired, then we check the refresh token to refresh
    if (err instanceof errors.JWTExpired) {
      refresh = true;
    } else {
      return NextResponse.redirect(new URL(CONFIG.pages.signin, req.url));
    }
  }

  // next we validate the refresh token
  try {
    await jwtVerify(
      verifiedTokens.data.refreshToken,
      new TextEncoder().encode(CONFIG.jwt.refreshTokenSecret),
    );
  } catch (err) {
    // if there is any error with the refresh token then we redirect to signin
    return NextResponse.redirect(new URL(CONFIG.pages.signin, req.url));
  }

  // if refresh needed, then we refresh the client :)
  if (refresh) {
    return NextResponse.redirect(
      new URL(`${CONFIG.pages.auth}/refresh`, req.url),
    );
  }

  return NextResponse.next();
};
