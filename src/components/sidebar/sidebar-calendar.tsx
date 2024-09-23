import React from "react";

import { Separator } from "@/components/ui/separator";
import { CreateButton } from "@/components/sidebar/create-button";

export const SideBarCalendar = () => {
  return (
    <div className="flex w-full flex-col justify-center gap-4">
      <CreateButton />

      <Separator />

      <h2 className="text-lg font-bold">Agenda</h2>

      <Separator />

      <div>
        <h2 className="text-lg font-bold">Calendars</h2>
      </div>
    </div>
  );
};
