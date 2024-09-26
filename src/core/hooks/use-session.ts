import { useContext } from "react";

import { SessionContext } from "@/core/context/session-context";
import { T_Session } from "@/core/types/validators";

// Custom hook to return the session from the session provider with context
export const useSession = (): undefined | T_Session | string => {
  // base case
  if (!SessionContext) {
    throw new Error("You can not use useSession in a server component");
  }

  // get session info from context
  const data = useContext(SessionContext);

  if (!data) {
    throw new Error(
      "The component you use useSession needs to be wrapped in a SessionProvider",
    );
  }

  // return info
  return data;
};
