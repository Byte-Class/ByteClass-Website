import { router } from "@/server/trpc";
import { dashboard } from "@/server/routers/dashboard";
import { calendar } from "@/server/routers/calendar";

export const appRouter = router({
  dashboard,
  calendar,
});

export type AppRouter = typeof appRouter;
