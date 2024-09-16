import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { google } from "googleapis";
import { Chrome } from "lucide-react";
import { redirect } from "next/navigation";
import { SCOPES } from "@/core/data/scopes";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign In | ByteClass",
  icons: "/logo/byte.png",
};

export default function SignIn() {
  return (
    <main
      className="flex h-lvh w-full items-center justify-center bg-cover"
      style={{ backgroundImage: "url('/signin-background.png')" }}
    >
      <form
        action={async () => {
          "use server";
          const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URL,
          );

          const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: SCOPES,
          });

          redirect(url);
        }}
        className="flex h-[43%] w-[43%] flex-col items-center justify-between rounded-2xl border-4 border-solid border-secondary bg-background p-4"
      >
        <Link href="/">
          <Image
            src="/logo/byte.png"
            width={100}
            height={100}
            alt="ByteClass Logo"
            className="mr-4"
          />
        </Link>
        <Button
          type="submit"
          className="flex w-4/5 items-center justify-start gap-4 rounded-3xl font-bold"
        >
          <Chrome /> Continue With Google
        </Button>

        <p className="mr-auto font-bold">
          <span className="text-red-600">*</span> Use your google account linked
          to your Google Classroom
        </p>
      </form>
    </main>
  );
}
