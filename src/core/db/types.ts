import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { calendar, event } from "@/core/db/schema";

export const selectCalendarSchema = createSelectSchema(calendar);
export const selectEventSchema = createSelectSchema(event);

export type TCalendar = z.infer<typeof selectCalendarSchema>;
export type TEvent = z.infer<typeof selectEventSchema>;
