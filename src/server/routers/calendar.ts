import Error from "postgres";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { router, userProcedure } from "@/server/trpc";
import { CalendarValidator } from "@/core/types/validators";
import { db } from "@/core/db";
import { calendar as calendarTable } from "@/core/db/schema";
import { TRPCError } from "@trpc/server";
import { DRIZZLE_ERRORS } from "@/core/data/error-codes";

// calendar router
export const calendar = router({
  // Create a calendar
  create: userProcedure
    .input(CalendarValidator)
    .mutation(async ({ input, ctx }) => {
      try {
        await db.insert(calendarTable).values({
          user_id: ctx.session.user.id,
          name: input.name,
          description: input.description,
        });
      } catch (err) {
        if (err instanceof Error.PostgresError) {
          if (err.code === DRIZZLE_ERRORS.UNIQUE_CONSTRAINT_VIOLATION) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "You can not create a calendar with a duplicate name",
              cause: "Calendar Name",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An Unknown Error has occurred",
          cause: "An Unknown Error has occurred",
        });
      }

      return {
        detail: "Success",
      };
    }),
  getAll: userProcedure.query(async ({ ctx }) => {
    try {
      return await db
        .select()
        .from(calendarTable)
        .where(eq(calendarTable.user_id, ctx.session.user.id))
        .orderBy(asc(calendarTable.name));
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An Unknown Error has occurred",
        cause: "An Unknown Error has occurred",
      });
    }
  }),
  toggle: userProcedure
    .input(
      z.object({
        calendarId: z.string().cuid2(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await db.execute(
          sql`update ${calendarTable} set active = NOT active where ${calendarTable.id} = ${input.calendarId} and ${calendarTable.user_id} = ${ctx.session.user.id}`,
        );
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An Unknown Error has occurred",
          cause: "An Unknown Error has occurred",
        });
      }

      return {
        detail: "Success",
      };
    }),
});
