"use client";
import React from "react";

import { SessionContext } from "@/core/context/session-context";
import { T_Session } from "@/core/types/validators";

export const SessionProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: T_Session;
}) => {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
