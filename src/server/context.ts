import { auth } from "@/core/hooks/auth";
export async function createContext() {
  const session = await auth();

  if (session === undefined) {
    return {};
  }

  return { session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
