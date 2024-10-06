import { auth } from "@/core/auth";

export async function createContext() {
  const session = await auth();

  if (session === undefined) {
    return {};
  }

  return { session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
