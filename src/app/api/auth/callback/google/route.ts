import { SignJWT } from "jose";
import { redirect } from "next/navigation";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { addHours } from "date-fns";
import { eq } from "drizzle-orm";

import { GoogleAuthRes, T_GoogleAuthRes } from "@/core/types/validators";
import { db } from "@/core/db";
import { googleInfo, session, user } from "@/core/db/schema";

// Route to handle google oauth
export async function GET(req: Request) {
  const url = new URL(req.url);

  // create oauth 2 client with google auth
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
  );

  // get oauth code from url
  const code = url.searchParams.get("code");

  if (!code) {
    redirect("http://localhost:3000/error");
  }

  // fetch tokens from oauth 2 client
  const { tokens, res } = await oauth2Client.getToken(code);

  // Set creds and global auth
  oauth2Client.setCredentials(tokens);

  google.options({
    auth: oauth2Client,
  });

  if (!res) {
    redirect("http://localhost:3000/error");
  }

  // fetch user data and verify
  const person = google.people("v1");

  const { names, photos, emailAddresses } = (
    await person.people.get({
      resourceName: "people/me",
      personFields: "photos,names,emailAddresses",
    })
  ).data;

  if (!names || !photos || !emailAddresses) {
    redirect("http://localhost:3000/error");
  }

  const name = names[0].displayName;
  const photo = photos[0].url;
  const email = emailAddresses[0].value;

  if (!name || !photo || !email) {
    redirect("http://localhost:3000/error");
  }

  // Verify the user is part of Ormiston Senior College
  if (!(email.split("@")[1] === "ormiston.school.nz")) {
    redirect("http://localhost:3000/error");
  }

  const googleRes = res.data;

  // verify integrity of google response, AS GOOGLE OFTEN FUCKS ME OVER
  if (!GoogleAuthRes.safeParse(googleRes).success) {
    redirect("http://localhost:3000/error");
  }

  const providerData = googleRes as T_GoogleAuthRes;

  // Auth with JWT/Sessions
  // Insert the user into the database if NOT exists
  let userId;

  try {
    await db
      .insert(user)
      .values({
        name: name,
        email: email,
        photo: photo,
        role: "user",
      })
      .onConflictDoNothing();

    userId = await db
      .selectDistinct({
        id: user.id,
      })
      .from(user)
      .where(eq(user.email, email));
  } catch (err) {
    redirect("http://localhost:3000/error");
  }

  userId = userId[0].id;

  // Insert google provider data into database
  try {
    await db
      .insert(googleInfo)
      .values({
        user_id: userId,
        access_token: providerData.access_token,
        refresh_token: providerData.refresh_token,
        scope: providerData.scope,
        id_token: providerData.id_token,
        token_type: providerData.token_type,
        expiry_date: providerData.expiry_date,
      })
      .onConflictDoUpdate({
        target: googleInfo.user_id,
        set: {
          access_token: providerData.access_token,
          refresh_token: providerData.refresh_token,
          scope: providerData.scope,
          id_token: providerData.id_token,
          token_type: providerData.token_type,
          expiry_date: providerData.expiry_date,
        },
      });
  } catch (err) {
    redirect("http://localhost:3000/error");
  }

  // Create Session
  const sessionExpiration = addHours(new Date(), 2);

  let sessionToken;

  // Validate previous session, or insert a new one
  try {
    const sessionExists = await db
      .selectDistinct()
      .from(session)
      .where(eq(session.user_id, userId));

    // if no sessions exist, then we need to insert a session for the user
    if (sessionExists.length === 0) {
      sessionToken = await db
        .insert(session)
        .values({
          user_id: userId,
          expires: sessionExpiration,
        })
        .returning({
          sessionToken: session.id,
        });
    }

    // if the session does exist, then we just update the session for the user
    if (sessionExists.length > 0) {
      sessionToken = await db
        .update(session)
        .set({
          expires: sessionExpiration,
        })
        .where(eq(session.user_id, userId))
        .returning({ sessionToken: session.id });
    }
  } catch (err) {
    redirect("http://localhost:3000/error");
  }

  if (!sessionToken || sessionToken.length === 0) {
    redirect("http://localhost:3000/error");
  }

  // Issue access token/refresh token with JWT
  const token = await new SignJWT({
    sessionId: sessionToken[0].sessionToken,
  })
    .setExpirationTime(sessionExpiration)
    .setIssuedAt()
    .setProtectedHeader({
      alg: "HS256",
    })
    .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));

  // send to client with cookies 🍪
  cookies().set("session", token, {
    httpOnly: true,
    secure: true,
  });

  // redirect
  redirect("http://localhost:3000/dashboard");
}
