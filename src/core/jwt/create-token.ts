import { SignJWT } from "jose";
import { addSeconds } from "date-fns";
import { CONFIG } from "../data/config";

/**
 * Function To generate an access token
 * @param id id of user
 * @param secondsToAdd seconds to add to current time
 * @returns Signed JWT Access token
 */
export const createAccessToken = async (id: string, secondsToAdd: number) =>
  await new SignJWT({
    id,
  })
    .setExpirationTime(addSeconds(new Date(), secondsToAdd))
    .setIssuedAt()
    .setProtectedHeader({
      alg: "HS256",
    })
    .sign(new TextEncoder().encode(CONFIG.jwt.accessTokenSecret));

/**
 * Function To generate a refresh token
 * @param id id of user
 * @param secondsToAdd seconds to add to current time
 * @returns Signed JWT refresh token
 */

export const createRefreshToken = async (id: string, secondsToAdd: number) =>
  await new SignJWT({
    id,
  })
    .setExpirationTime(addSeconds(new Date(), secondsToAdd))
    .setIssuedAt()
    .setProtectedHeader({
      alg: "HS256",
    })
    .sign(new TextEncoder().encode(CONFIG.jwt.refreshTokenSecret));
