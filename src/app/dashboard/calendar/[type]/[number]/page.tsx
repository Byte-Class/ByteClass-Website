import { type Metadata } from "next";
import { z } from "zod";

import { DayCalendar } from "@/components/calendar/day";
import { MonthCalendar } from "@/components/calendar/month";
import { WeekCalendar } from "@/components/calendar/week";
import { SwitchCalendarType } from "@/components/calendar/switch-type";

export const metadata = {
  title: "Calendar | ByteClass",
  icons: "/logo/byte.png",
} satisfies Metadata;

const validateParams = z.object({
  type: z.union([z.literal("month"), z.literal("week"), z.literal("day")]),
  number: z.coerce.number(),
});

export default async function Page({
  params,
}: {
  params: Record<string, string>;
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <SwitchCalendarType />

      {ShowCalendar(params)}
    </div>
  );
}

const ShowCalendar = (params: Record<string, string>) => {
  const validatedParams = validateParams.safeParse(params);

  if (!validatedParams.success) {
    return <h2>{validatedParams.error.message}</h2>;
  }

  switch (validatedParams.data.type) {
    case "month":
      return <MonthCalendar />;
    case "week":
      return <WeekCalendar offset={validatedParams.data.number} />;
    case "day":
      return <DayCalendar />;
  }
};
