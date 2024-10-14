import { ReactNode } from "react";

import { Navbar } from "@/components/navbar";
import { SideBar } from "@/components/sidebar";
import { SideBarGeneral } from "@/components/sidebar/sidebar-general";
import { SideBarCalendar } from "@/components/sidebar/sidebar-calendar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />

      <div className="flex h-[calc(100lvh-7rem)] w-full gap-2">
        <SideBar>
          <SideBarCalendar />
          <SideBarGeneral />
        </SideBar>

        <main className="flex-grow px-2">{children}</main>
      </div>
    </>
  );
}
