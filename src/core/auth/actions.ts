"use server";

import { google } from "googleapis";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { CONFIG } from "@/core/data/config";
import { SCOPES } from "@/core/data/scopes";

export const signIn = async () => {
  const client = new google.auth.OAuth2(
    CONFIG.google.clientId,
    CONFIG.google.clientSecret,
    CONFIG.google.redirectUrl,
  );

  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  redirect(url);
};

export const signOut = async () => {
  const cookieStore = cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  redirect(CONFIG.pages.signin);
};
