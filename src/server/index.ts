import { router } from "@/server/trpc";
import { dashboard } from "@/server/routers/dashboard";

export const appRouter = router({
  dashboard,
});

export type AppRouter = typeof appRouter;
