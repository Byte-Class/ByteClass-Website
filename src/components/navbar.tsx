import Link from "next/link";
import Image from "next/image";

import { greeting } from "@/core/utils/greeting";
import { BreadCrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/core/auth/actions";
import { auth } from "@/core/auth";

export const Navbar = async () => {
  const session = await auth();

  console.log(session?.user.photo);

  // return Not logged In navbar
  if (!session) {
    return (
      <nav className="flex h-28 w-full items-center justify-between px-12 py-4">
        <Image
          src={"/logo/byte.png"}
          alt={"ByteClass logo"}
          width={100}
          height={100}
        />

        <Link href={"/signin"}>
          <Button className="px-12 py-8" type="submit">
            Sign In
          </Button>
        </Link>
      </nav>
    );
  }

  // return logged in navbar
  return (
    <nav className="flex h-28 w-full items-center justify-between gap-4 px-12 py-4">
      <Avatar>
        <AvatarImage src={session.user.photo} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="mr-auto flex flex-col gap-2 font-bold">
        <p>
          {greeting(new Date())} {session.user.name.split(" ")[0]} 👋
        </p>

        <BreadCrumbs />
      </div>

      <form action={signOut}>
        <Button className="px-12 py-8" type="submit">
          Sign Out
        </Button>
      </form>
    </nav>
  );
};
