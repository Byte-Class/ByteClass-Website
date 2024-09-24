import React from "react";

import { Separator } from "@/components/ui/separator";
import { CreateButton } from "@/components/sidebar/create-button";
import { serverTrpc } from "@/client/server";
import { auth } from "@/core/hooks/auth";

export const SideBarCalendar = async () => {
  const session = (await auth())!;

  const calendars = await serverTrpc({ session }).calendar.getAll();

  return (
    <div className="flex w-full flex-col justify-center gap-4">
      <CreateButton />

      <Separator />

      <h2 className="text-lg font-bold">Agenda</h2>

      <Separator />

      <div>
        <h2 className="text-lg font-bold">Calendars</h2>

        <div className="w-full">
          {calendars.map((calendar) => {
            return <p key={calendar.id}>{calendar.name}</p>;
          })}

          {calendars.length === 0 && <p>Create a calendar pwease 🥺👉👈</p>}
        </div>
      </div>
    </div>
  );
};
