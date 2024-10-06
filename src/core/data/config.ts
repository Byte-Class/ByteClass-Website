import { AuthConfig } from "@/core/types/validators";

export const CONFIG = {
  pages: {
    home: "/",
    signin: "/signin",
    dashboard: "/dashboard",
    authError: "/auth/error",
    auth: "/api/auth",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl: process.env.GOOGLE_REDIRECT_URL,
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    expiration: {
      accessToken: 60 * 60 * 2, // 2 Hours
      refreshToken: 60 * 60 * 24 * 7, // 7 Days
    },
  },
} satisfies AuthConfig;
