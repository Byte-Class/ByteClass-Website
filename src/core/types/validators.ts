import { z } from "zod";

export const GoogleAuthRes = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
  id_token: z.string(),
  expiry_date: z.number(),
});

export type T_GoogleAuthRes = z.infer<typeof GoogleAuthRes>;

export const AccessToken = z.object({
  sessionId: z.string(),
  exp: z.number(),
  iat: z.number(),
});

export type T_AccessToken = z.infer<typeof AccessToken>;
