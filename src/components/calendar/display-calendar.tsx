"use client";

import React, { Children, useCallback, JSX } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { CalendarSearchParams } from "@/core/types/validators";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const DEFAULT_VALUE: "month" | "week" | "day" = "week";

export const DisplayCalendar = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // dynamically change rendered children based off calendar type and current week
  const arrChildren = Children.toArray(children);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));

      // delete all current search params
      const keysInParams = params.keys().toArray();

      for (let i = 0; i < keysInParams.length; ++i) {
        params.delete(keysInParams[i]);
      }

      // Set params
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  // verify the search params
  const parse = CalendarSearchParams.safeParse(
    Object.fromEntries(searchParams.entries()),
  );

  if (!parse.success) {
    router.push(
      `${pathname}?${createQueryString("week", "0")}&${createQueryString("type", DEFAULT_VALUE)}`,
    );
    return;
  }

  const { week, type } = parse.data;

  return (
    <>
      <div className="w-full">
        <ToggleGroup
          type="single"
          variant={"outline"}
          onValueChange={(e) => {
            router.push(
              `${pathname}?${createQueryString(DEFAULT_VALUE, week.toString())}&${createQueryString("type", e.valueOf())}`,
            );
          }}
          defaultValue={DEFAULT_VALUE}
        >
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="day">Day</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {type === "month"
        ? React.cloneElement(arrChildren[0] as JSX.Element, { week })
        : type === "week"
          ? arrChildren[1]
          : arrChildren[2]}
    </>
  );
};
