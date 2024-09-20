import { Navbar } from "@/components/navbar";
import { SideBar } from "@/components/sidebar";
import { SideBarGeneral } from "@/components/sidebar/sidebar-general";

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
          <h2>CALENDAR</h2>
          <SideBarGeneral />
        </SideBar>

        <main>{children}</main>
      </div>
    </>
  );
}
