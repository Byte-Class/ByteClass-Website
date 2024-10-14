import { router } from "@/server/trpc";
import { dashboard } from "@/server/routers/dashboard";
import { calendar } from "@/server/routers/calendar";
import { event } from "@/server/routers/event";

import { auth } from "@/server/routers/auth/auth";

export const appRouter = router({
  dashboard,
  calendar,
  event,

  auth,
});

export type AppRouter = typeof appRouter;
