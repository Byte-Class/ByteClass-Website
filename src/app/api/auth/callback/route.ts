import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { CONFIG } from "@/core/data/config";
import { authCaller } from "@/client/server";

const handler = async (req: NextRequest) => {
  // fetch code from URL
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return redirect(
      `${CONFIG.pages.authError}?error=Code is required, received undefined`,
    );
  }

  // call a TRPC endpoint to handle all signin functionality, this returns the tokens too
  const { accessToken, refreshToken } = await authCaller().auth.login({
    code,
  });

  // store cookies
  const cookieStore = cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // redirect to dashboard
  return redirect(CONFIG.pages.dashboard);
};

export { handler as GET };
