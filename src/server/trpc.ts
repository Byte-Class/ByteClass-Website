import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "@/server/context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const userProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      cause: "Session is not in context",
      message: "Bro you are NOT authorized",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});
