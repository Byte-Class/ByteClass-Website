import Image from "next/image";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flex h-28 w-full items-center justify-between px-12 py-4">
      <Image
        src={"/logo/byte.png"}
        alt={"ByteClass logo"}
        width={100}
        height={100}
      />

      <Link href={"/signin"}>
        <Button className="px-12 py-8">Sign In</Button>
      </Link>
    </nav>
  );
};
