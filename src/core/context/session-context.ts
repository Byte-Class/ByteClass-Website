import { createContext } from "react";

import { T_Session } from "@/core/types/validators";

// Session Context
export const SessionContext = createContext<null | T_Session>(null);
