import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";

import { CONFIG } from "@/core/data/config";
import { TokenPayload, TSession } from "@/core/types/validators";
import { db } from "@/core/db";
import { googleInfo, user } from "@/core/db/schema";

/**
 * Function to return a server session
 * @returns Promise<TSession | undefined>
 */
export const auth = async (): Promise<TSession | undefined> => {
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) {
    return undefined;
  }

  let payload;

  try {
    payload = (
      await jwtVerify(
        accessToken,
        new TextEncoder().encode(CONFIG.jwt.accessTokenSecret),
      )
    ).payload;
  } catch (err) {
    return undefined;
  }

  // verify malformed JWT
  const verifiedPayload = TokenPayload.safeParse(payload);

  if (!verifiedPayload.success) {
    return undefined;
  }

  const userId = verifiedPayload.data.id;

  // get user info
  let userInfo;

  try {
    userInfo = (
      await db
        .selectDistinct({
          name: user.name,
          email: user.email,
          photo: user.photo,
          role: user.role,
        })
        .from(user)
        .where(eq(user.id, userId))
    )[0];
  } catch (err) {
    return undefined;
  }

  // fetch provider info
  let providerInfo;

  try {
    providerInfo = (
      await db
        .selectDistinct({
          accessToken: googleInfo.access_token,
          refreshToken: googleInfo.refresh_token,
        })
        .from(googleInfo)
        .where(eq(googleInfo.user_id, userId))
    )[0];
  } catch (err) {
    return undefined;
  }

  return {
    user: {
      id: userId,
      name: userInfo.name,
      email: userInfo.email,
      photo: userInfo.photo,
      role: userInfo.role,
    },
    google: {
      accessToken: providerInfo.accessToken,
      refreshToken: providerInfo.refreshToken,
    },
  };
};
