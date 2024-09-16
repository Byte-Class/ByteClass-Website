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
