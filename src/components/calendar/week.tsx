import {
  addWeeks,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfWeek,
  format,
  formatISO,
  isToday,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns";

import { TEvent } from "@/core/db/types";
import { serverTrpc } from "@/client/server";

import { Separator } from "@/components/ui/separator";
import { WeekEvent } from "@/components/calendar/event";

const timesInDay = eachHourOfInterval({
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
});

export const WeekCalendar = async ({ offset }: { offset: number }) => {
  const today = new Date();
  const weekToRender = addWeeks(today, offset);

  const start = startOfWeek(weekToRender);
  const end = endOfWeek(weekToRender);

  const weekInterval = eachDayOfInterval({
    start,
    end,
  });

  const server = await serverTrpc();

  const eventsToDisplay = await server.event.fetchEventsForWeek({
    start: formatISO(start),
    end: formatISO(end),
  });

  type TKeys = keyof typeof eventsPerDay;

  const eventsPerDay: Record<string, TEvent[]> = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  for (const event of eventsToDisplay)
    eventsPerDay[format(parseISO(event.day), "eeee") as TKeys].push(event);

  return (
    <div className="flex w-full flex-grow overflow-x-hidden overflow-y-scroll">
      <div className="mt-12 w-16">
        {timesInDay.map((time) => {
          return (
            <div
              key={time.toISOString()}
              className="relative flex aspect-square w-full items-center justify-center"
            >
              <p>
                {format(time, "h")} {format(time, "a")}
              </p>
              <Separator className="absolute left-16 w-[calc(100vw-15rem)]" />
            </div>
          );
        })}
      </div>

      <div className="flex flex-grow">
        {weekInterval.map((day) => {
          return (
            <div className="relative flex flex-1 flex-col" key={day.getDay()}>
              {/* Day Information */}
              <div className="flex h-20 flex-col items-center justify-center gap-2">
                <h2 className="text-xl font-bold">{format(day, "E")}</h2>

                {isToday(day) ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                    <p>{format(day, "dd")}</p>
                  </div>
                ) : (
                  <div>
                    <p>{format(day, "dd")}</p>
                  </div>
                )}
              </div>
              {/* Display Events */}
              <div className="bg-red relative">
                {DisplayEvents(eventsPerDay[format(day, "eeee") as TKeys])}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DisplayEvents = (items: TEvent[]) => {
  return (
    <>
      {items.map((event) => (
        <WeekEvent key={event.id} event={event} />
      ))}
    </>
  );
};
