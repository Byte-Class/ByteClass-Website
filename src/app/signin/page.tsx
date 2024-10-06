import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Chrome } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signIn } from "@/core/auth/actions";

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
        action={signIn}
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
