"use client";

import { usePathname } from "next/navigation";
import { Children } from "react";

// Sidebar wrapper with slots for ssr sidebars
export const SideBar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // convert all children to an array, then we display them accordingly
  const arrChildren = Children.toArray(children);

  // if the current path is the calendar, then we return the calendar sidebar, else we just return the general sidebar
  return (
    <div className="min-h-[calc(100lvh-7rem)] w-56 border-r-[1px] px-2">
      {pathname === "/dashboard/calendar" ? arrChildren[0] : arrChildren[1]}
    </div>
  );
};
