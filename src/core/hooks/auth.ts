import { cookies } from "next/headers";
import { fromUnixTime, isBefore } from "date-fns";
import { decodeJwt } from "jose";
import { eq } from "drizzle-orm";

import { AccessToken, T_AccessToken } from "@/core/types/validators";
import { db } from "@/core/db";
import { session, user } from "@/core/db/schema";

export const auth = async () => {
  const token = cookies().get("session")?.value;

  if (token === undefined) {
    return undefined;
  }

  // verify integrity of payload
  const payload = decodeJwt(token);

  // once this guard clause is done, then we know the token has the right payload data
  if (!AccessToken.safeParse(payload).success) {
    return undefined;
  }

  const tokenData = payload as T_AccessToken;

  // Verify token expiration, and session
  if (isBefore(fromUnixTime(tokenData.exp), new Date())) {
    return undefined;
  }

  const sessionId = tokenData.sessionId;

  // Fetch Session data
  const exists = await db
    .selectDistinct()
    .from(session)
    .where(eq(session.id, sessionId));

  if (exists.length === 0 || exists[0] == undefined) {
    return undefined;
  }

  // Fetch user data
  const userData = await db
    .selectDistinct()
    .from(user)
    .where(eq(user.id, exists[0].user_id));

  if (exists.length === 0 || userData[0] == undefined) {
    return undefined;
  }

  return {
    user: {
      id: userData[0].id,
      name: userData[0].name,
      email: userData[0].email,
      photo: userData[0].photo,
    },
    sessionId: exists[0].id,
    expires: exists[0].expires,
  };
};
