import React from "react";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";

export const SideBarGeneral = () => {
  const links = [
    {
      title: "Calendar",
      href: "/calendar?week=0&type=week",
    },
    {
      title: "My Files",
      href: "/my-files",
    },
    {
      title: "Todo",
      href: "/todo",
    },
  ];

  return (
    <div className="flex w-full flex-col justify-center">
      {links.map((link) => {
        return (
          <React.Fragment key={link.title}>
            <Link
              href={`/dashboard/${link.href}`}
              className="text-lg font-bold transition-all hover:text-blue-500"
            >
              {link.title}
            </Link>
            <Separator className="my-2" />
          </React.Fragment>
        );
      })}
    </div>
  );
};
