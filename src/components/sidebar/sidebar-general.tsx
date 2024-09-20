import Link from "next/link";

import { Separator } from "@/components/ui/separator";

export const SideBarGeneral = () => {
  const links = [
    {
      title: "Calendar",
      href: "/calendar",
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
          <>
            <Link
              href={`/dashboard/${link.href}`}
              className="text-lg font-bold"
            >
              {link.title}
            </Link>
            <Separator className="my-2 ml-2 w-[calc(100%-0.5rem)]" />
          </>
        );
      })}
    </div>
  );
};
