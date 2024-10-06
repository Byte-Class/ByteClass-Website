import { google } from "googleapis";
import { jwtVerify } from "jose";
import { z } from "zod";

import { CONFIG } from "@/core/data/config";
import { db } from "@/core/db";
import { createAccessToken, createRefreshToken } from "@/core/jwt/create-token";
import { googleInfo, user } from "@/core/db/schema";
import { TokenPayload } from "@/core/types/validators";
import { authProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

const verifyTokens = z
  .object({
    access_token: z.string(),
    refresh_token: z.string(),
    scope: z.string(),
    token_type: z.string(),
    id_token: z.string(),
    expiry_date: z.number(),
  })
  .strict();

export const auth = router({
  login: authProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const client = new google.auth.OAuth2(
        CONFIG.google.clientId,
        CONFIG.google.clientSecret,
        CONFIG.google.redirectUrl,
      );

      // fetch tokens and verify with zod
      const tokens = verifyTokens.safeParse(
        (await client.getToken(input.code)).tokens,
      );

      if (!tokens.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: "Google did NOT return the right information",
          message: "Invalid token format",
        });
      }

      // set google credentials
      client.setCredentials(tokens.data);
      google.options({
        auth: client,
      });

      // fetch the user information with the peoples API
      const person = google.people("v1");

      const { names, photos, emailAddresses } = (
        await person.people.get({
          resourceName: "people/me",
          personFields: "names,photos,emailAddresses",
        })
      ).data;

      if (!names || !photos || !emailAddresses) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: "Google did NOT return the right information",
          message: "Error fetching user info",
        });
      }

      const name = names[0].displayName;
      const photo = photos[0].url;
      const email = emailAddresses[0].value;

      if (!name || !photo || !email) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: "Google did NOT return the right information",
          message: "Error fetching user info",
        });
      }

      // now we insert user into database
      let id;

      try {
        id = (
          await db
            .insert(user)
            .values({
              name: name,
              email: email,
              photo: photo,
              role: "user",
            })
            .onConflictDoUpdate({
              target: user.email,
              set: {
                updated_at: new Date(),
              },
            })
            .returning({
              id: user.id,
            })
        )[0].id;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: "Database",
          message: "Error inserting user into database",
        });
      }

      try {
        await db
          .insert(googleInfo)
          .values({
            user_id: id,
            access_token: tokens.data.access_token,
            refresh_token: tokens.data.refresh_token,
            scope: tokens.data.scope,
            id_token: tokens.data.id_token,
            token_type: tokens.data.token_type,
            expiry_date: tokens.data.expiry_date,
          })
          .onConflictDoUpdate({
            target: googleInfo.user_id,
            set: {
              access_token: tokens.data.access_token,
              refresh_token: tokens.data.refresh_token,
              scope: tokens.data.scope,
              id_token: tokens.data.id_token,
              token_type: tokens.data.token_type,
              expiry_date: tokens.data.expiry_date,
            },
          });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: err,
          message: "Unable to insert provider information",
        });
      }

      // now we just generate access/refresh tokens, and return them to the client
      const accessToken = await createAccessToken(id, 10);
      const refreshToken = await createRefreshToken(
        id,
        CONFIG.jwt.expiration.refreshToken,
      );

      return { accessToken, refreshToken };
    }),
  refresh: authProcedure
    .input(
      z.object({
        refreshToken: z.string(),
      }),
    )
    .query(async ({ input }) => {
      let payload;

      try {
        payload = (
          await jwtVerify(
            input.refreshToken,
            new TextEncoder().encode(CONFIG.jwt.refreshTokenSecret),
          )
        ).payload;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: err,
          message: "Error verifying refresh token",
        });
      }

      // check for malformed JWT/verify payload
      const verifiedPayload = TokenPayload.safeParse(payload);

      if (!verifiedPayload.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: verifiedPayload.error.flatten(),
          message: "Malformed JWT",
        });
      }

      // Issue new access token
      const accessToken = await createAccessToken(
        verifiedPayload.data.id,
        CONFIG.jwt.expiration.accessToken,
      );

      return {
        accessToken,
      };
    }),
});
