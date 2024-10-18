import {
  addWeeks,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfWeek,
  format,
  formatISO,
  isSameDay,
  isToday,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns";

import { TEvent } from "@/core/db/types";
import { serverTrpc } from "@/client/server";

import { Separator } from "@/components/ui/separator";
import { WeekEvent } from "@/components/calendar/event";
import { CurrentTimeIndicator } from "@/components/calendar/current-time";

const timesInDay = eachHourOfInterval({
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
});

export const WeekCalendar = async ({ offset }: { offset: number }) => {
  const today = new Date();
  const weekToRender = addWeeks(today, offset); // Week that needed to render due to offset in URL

  const start = startOfWeek(weekToRender);
  const end = endOfWeek(weekToRender);

  const weekInterval = eachDayOfInterval({
    start,
    end,
  });

  // fetch events for this week
  const server = await serverTrpc();
  const eventsToDisplay = await server.event.fetchEventsForWeek({
    start: formatISO(start),
    end: formatISO(end),
  });

  // JSON object of days that's needed to display for this week
  const eventsPerDay: Record<string, TEvent[]> = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  type TKeys = keyof typeof eventsPerDay;

  // Loop over all events and add them to their week in the eventsPerDay
  for (const event of eventsToDisplay)
    eventsPerDay[format(parseISO(event.day), "eeee") as TKeys].push(event);

  return (
    <div className="relative flex w-full flex-grow flex-col overflow-x-hidden">
      {/* Day information at the top */}
      <div className="ml-16 flex h-24 w-[calc(100%-4rem)] py-2">
        {weekInterval.map((day) => {
          return (
            <div
              className="flex h-full flex-1 flex-col items-center justify-center"
              key={day.toISOString()}
            >
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
          );
        })}
      </div>

      {/* Events and times */}
      <div className="flex flex-grow overflow-x-hidden overflow-y-scroll">
        {/* Times */}
        <div className="h-auto w-16">
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

        {/* Events */}
        <div className="flex h-full flex-grow">
          {weekInterval.map((day) => {
            return (
              <div className="relative flex-grow" key={day.getUTCDay()}>
                {DisplayEvents(eventsPerDay[format(day, "eeee") as TKeys])}

                {isSameDay(day, new Date()) && <CurrentTimeIndicator />}
              </div>
            );
          })}
        </div>
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
