import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authCaller } from "@/client/server";
import { CONFIG } from "@/core/data/config";

// route handler to refresh a session, just a wrapper, actual code is inside tRPC
const handler = async () => {
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

  return redirect(CONFIG.pages.dashboard);
};

export { handler as GET };
