"use client";

import {
  format,
  differenceInMinutes,
  getHours,
  getMinutes,
  parseISO,
} from "date-fns";

import { TEvent } from "@/core/db/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateEventForm } from "@/components/calendar/update-event";

type TTime = {
  start: string;
  end: string;
};

const MAX_NAME_LENGTH = 18; // 17 characters is the max length of the name of an event

// function to format the time of a class
const formatDate = (start: Date, end: Date) => {
  if (format(start, "aaa") === format(end, "aaa")) {
    return `${format(start, "h")}:${format(start, "mm")}-${format(end, "h")}:${format(end, "mm")}${format(start, "a")}`;
  }

  return `${format(start, "h")}:${format(start, "mm")}${format(start, "a")}-${format(end, "h")}:${format(end, "mm")}${format(start, "a")}`;
};

export const WeekEvent = ({ event }: { event: TEvent }) => {
  const start = parseISO((event.time as TTime).start);
  const end = parseISO((event.time as TTime).end);

  // top and height values
  const top = getHours(start) * 64 + (getMinutes(start) / 60) * 64 + 32;
  const height = (differenceInMinutes(end, start) / 60) * 64;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="absolute flex w-full cursor-pointer flex-col justify-center rounded-md p-2"
          style={{
            backgroundColor: `#${event.colour}CC`,
            borderLeft: `solid 4px #${event.colour}`,
            top: `${top}px`,
            height: `${height}px`,
          }}
          key={event.id}
        >
          <p className="font-bold">
            {event.name.split("").length >= MAX_NAME_LENGTH ? (
              <>{event.name.split("").slice(0, MAX_NAME_LENGTH)}...</>
            ) : (
              event.name
            )}
          </p>

          {height < 64 ? null : (
            <p className="text-xs font-bold">{formatDate(start, end)}</p>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>

        <UpdateEventForm event={event} />
      </DialogContent>
    </Dialog>
  );
};
