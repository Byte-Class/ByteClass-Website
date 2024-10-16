import { z } from "zod";
import { eachDayOfInterval, formatISO, parseISO } from "date-fns";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/core/db";
import { event as eventTable, calendar } from "@/core/db/schema";
import { EventValidator } from "@/core/types/validators";
import { router, userProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

const INVALID_DATE = "Invalid Date";

// Event router
export const event = router({
  // Create an event
  create: userProcedure
    .input(
      EventValidator.extend({
        day: z.string(),
        start: z.string(),
        end: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // verify correct time
      const day = parseISO(input.day);
      const start = parseISO(input.start);
      const end = parseISO(input.end);

      if (
        day.toString() === INVALID_DATE ||
        start.toString() === INVALID_DATE ||
        end.toString() === INVALID_DATE
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "Date Invalid",
          message: "day, start, or end times are invalid ISO times",
        });
      }

      try {
        await db.insert(eventTable).values({
          calendar_id: input.calendar,
          name: input.name,
          description: input.description,
          day: input.day,
          time: {
            start: input.start,
            end: input.end,
          },
          colour: input.colour,
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: err,
          message: "Unable to insert event into table",
        });
      }

      return {
        detail: "Success",
      };
    }),
  fetchEventsForWeek: userProcedure
    .input(z.object({ start: z.string(), end: z.string() }))
    .query(async ({ input, ctx }) => {
      // verify dates
      const start = parseISO(input.start);
      const end = parseISO(input.end);

      if (
        start.toString() === INVALID_DATE ||
        end.toString() === INVALID_DATE
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "Date Invalid",
          message: "day, start, or end times are invalid ISO times",
        });
      }

      // fetch active calendars
      const activeCalendars = (
        await db
          .select({
            id: calendar.id,
          })
          .from(calendar)
          .where(
            and(
              eq(calendar.user_id, ctx.session.user.id),
              eq(calendar.active, true),
            ),
          )
      ).map((c) => c.id);

      // date range
      const weekInterval = eachDayOfInterval({
        start,
        end,
      }).map((d) => formatISO(d));

      const events = [];

      for (let i = 0; i < activeCalendars.length; ++i) {
        const calendar = activeCalendars[i];

        const eventsForCalendarOfWeek = await db
          .select()
          .from(eventTable)
          .where(
            and(
              eq(eventTable.calendar_id, calendar),
              inArray(eventTable.day, weekInterval),
            ),
          );

        events.push(...eventsForCalendarOfWeek);
      }

      return events;
    }),
  currentDayEvents: userProcedure.query(async ({}) => {
    return 0;
  }),
});
