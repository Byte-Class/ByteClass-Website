import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authCaller } from "@/client/server";
import { CONFIG } from "@/core/data/config";

// route handler to refresh a session, just a wrapper, actual code is inside tRPC
const handler = async (req: NextRequest) => {
  // fetch callback url, this is the URL the user was on before the refresh, hence we can redirect them back to their original URL
  const searchParams = req.nextUrl.searchParams;
  const url = searchParams.get("url") ?? CONFIG.pages.dashboard;

  // fetch refresh token/validate
  const cookieStore = cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return redirect("/");
  }

  let accessToken;

  try {
    accessToken = (await authCaller().auth.refresh({ refreshToken }))
      .accessToken;
  } catch (err) {
    // if error with creating access token, then we know the user has done something bad
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return redirect(CONFIG.pages.signin);
  }

  // set new access token, then redirect to dashboard

  cookieStore.set("accessToken", accessToken);

  return redirect(url);
};

export { handler as GET };
