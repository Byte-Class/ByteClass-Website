import { google } from "googleapis";
import { CONFIG } from "@/core/data/config";

export const authGoogle = (refreshToken: string) => {
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.google.clientId,
    CONFIG.google.clientSecret,
    CONFIG.google.redirectUrl,
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  google.options({
    auth: oauth2Client,
  });
};
