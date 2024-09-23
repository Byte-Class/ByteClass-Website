import { Navbar } from "@/components/navbar";
import { SideBar } from "@/components/sidebar";
import { SideBarGeneral } from "@/components/sidebar/sidebar-general";
import { SideBarCalendar } from "@/components/sidebar/sidebar-calendar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <div className="flex min-h-[calc(100lvh-7rem)] w-full gap-2">
        <SideBar>
          <SideBarCalendar />
          <SideBarGeneral />
        </SideBar>

        <main>{children}</main>
      </div>
    </>
  );
}
