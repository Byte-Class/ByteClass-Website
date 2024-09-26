import { type Metadata } from "next";

import { DayCalendar } from "@/components/calendar/day";
import { DisplayCalendar } from "@/components/calendar/display-calendar";
import { MonthCalendar } from "@/components/calendar/month";
import { WeekCalendar } from "@/components/calendar/week";

export const metadata = {
  title: "Calendar | ByteClass",
  icons: "/logo/byte.png",
} satisfies Metadata;

export default async function Page() {
  return (
    <div>
      <DisplayCalendar>
        <MonthCalendar />
        <WeekCalendar />
        <DayCalendar />
      </DisplayCalendar>
    </div>
  );
}
