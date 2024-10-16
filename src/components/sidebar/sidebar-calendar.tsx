import React from "react";

import { Separator } from "@/components/ui/separator";
import { CreateButton } from "@/components/sidebar/create-button";
import { serverTrpc } from "@/client/server";
import { CheckBoxSidebar } from "@/components/sidebar/checkbox";

export const SideBarCalendar = async () => {
  const server = await serverTrpc();

  const calendars = await server.calendar.all();
  // const currentDayEvents = await server.event.currentDayEvents();

  return (
    <div className="flex w-full flex-col justify-center gap-4">
      <CreateButton calendars={calendars} />

      <Separator />

      <div className="w-full">
        <h2 className="text-lg font-bold">Agenda</h2>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-bold">Calendars</h2>

        <div className="mt-2 flex w-full flex-col gap-2">
          {calendars.map((calendar) => {
            return (
              <CheckBoxSidebar
                key={calendar.id}
                id={calendar.id}
                text={calendar.name}
                active={calendar.active}
              />
            );
          })}

          {calendars.length === 0 && <p>Cweate a cawendar pwease 🥺👉👈</p>}
        </div>
      </div>
    </div>
  );
};
