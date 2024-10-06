import { z } from "zod";

export const CalendarValidator = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
});

export const EventValidator = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(1).max(200),
  location: z.string().min(1).max(100),
  day: z.date(),
  start: z.date(),
  end: z.date(),
});

export const CalendarSearchParams = z
  .object({
    type: z.union([z.literal("month"), z.literal("week"), z.literal("day")]),
    week: z.coerce.number(),
  })
  .strict();

export const validateMiddlewareTokens = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
  })
  .strict();

export const TokenPayload = z
  .object({
    id: z.string().cuid2(),
    exp: z.number(),
    iat: z.number(),
  })
  .strict();

export const Session = z
  .object({
    user: z.object({
      id: z.string().cuid2(),
      name: z.string(),
      email: z.string().email(),
      photo: z.string().url(),
      role: z.union([z.literal("user"), z.literal("admin")]),
    }),
    google: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
    }),
  })
  .strict();

export type TSession = z.infer<typeof Session>;

export type AuthConfig = {
  pages: {
    home: string;
    signin: string;
    dashboard: string;
    authError: string;
    auth: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
  };
  jwt: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    expiration: {
      accessToken: number;
      refreshToken: number;
    };
  };
};
