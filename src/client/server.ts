import { createCallerFactory } from "@/server/trpc";
import { appRouter } from "@/server";

import { auth } from "@/core/auth";

export const serverTrpc = async () => {
  const session = (await auth())!;

  const createCaller = createCallerFactory(appRouter);

  const caller = createCaller({ session });

  return caller;
};

export const authCaller = () => {
  const createCaller = createCallerFactory(appRouter);

  const caller = createCaller({ session: undefined });

  return caller;
};
