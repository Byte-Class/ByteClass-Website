"use client";

import { useRouter, usePathname } from "next/navigation";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { addWeeks, endOfWeek, format, startOfWeek } from "date-fns";

export const SwitchCalendarType = () => {
  const router = useRouter();
  const path = usePathname()
    .split("/")
    .filter((e) => e !== "");

  const calendarType = path[path.length - 2] as "month" | "week" | "day";

  const currentOffset = parseInt(path[path.length - 1]);

  return (
    <div className="flex w-full justify-between">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => {
            router.push(`${currentOffset - 1}`);
          }}
        >
          -
        </button>

        <button
          onClick={() => {
            router.push(`${currentOffset + 1}`);
          }}
        >
          +
        </button>

        <DisplayMonth calendarType={calendarType} offset={currentOffset} />
      </div>

      <ToggleGroup
        type="single"
        variant={"outline"}
        onValueChange={(e) => {
          router.push(`/dashboard/calendar/${e.valueOf()}/0`);
        }}
        value={calendarType}
      >
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

const DisplayMonth = ({
  calendarType,
  offset,
}: {
  calendarType: "month" | "week" | "day";
  offset: number;
}) => {
  switch (calendarType) {
    case "month":
      return <h2>e</h2>;
    case "week":
      const currentWeek = addWeeks(new Date(), offset);

      const start = startOfWeek(currentWeek);
      const end = endOfWeek(currentWeek);

      if (format(start, "MMM") === format(end, "MMM")) {
        return (
          <>
            {format(start, "MMMM")} {format(start, "y")}
          </>
        );
      }

      return (
        <>
          {format(start, "MMM")} - {format(end, "MMM")} {format(start, "y")}
        </>
      );

    case "day":
      return <h2>w chat</h2>;
  }
};
