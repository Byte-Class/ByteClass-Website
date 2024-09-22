import { google } from "googleapis";

export const authGoogle = (refreshToken: string) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  google.options({
    auth: oauth2Client,
  });
};
