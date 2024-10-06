import { createCallerFactory } from "@/server/trpc";
import { Context } from "@/server/context";
import { appRouter } from "@/server";

export const serverTrpc = (session: Context) => {
  const createCaller = createCallerFactory(appRouter);

  const caller = createCaller(session);

  return caller;
};

export const authCaller = () => {
  const createCaller = createCallerFactory(appRouter);

  const caller = createCaller({ session: undefined });

  return caller;
};
