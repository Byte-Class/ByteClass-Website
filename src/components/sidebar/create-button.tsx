"use client";

import React, { useState } from "react";
import { CalendarCheck, CalendarDays, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateCalendarForm } from "@/components/sidebar/form/create-calendar";
import { CreateEventForm } from "@/components/sidebar/form/create-event";
import { TCalendar } from "@/core/db/types";

export const CreateButton = ({ calendars }: { calendars: TCalendar[] }) => {
  const [createCalendar, setCreateCalendar] = useState<boolean>(false);
  const [createEvent, setCreateEvent] = useState<boolean>(false);

  return (
    <>
      <Dialog open={createCalendar} onOpenChange={setCreateCalendar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Calendar</DialogTitle>
          </DialogHeader>

          <CreateCalendarForm />
        </DialogContent>
      </Dialog>

      <Dialog open={createEvent} onOpenChange={setCreateEvent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>

          <CreateEventForm calendars={calendars} />
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex gap-2 font-bold">
            Create <Plus className="text-base" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <button
              onClick={() => {
                setCreateCalendar(true);
              }}
              className="flex items-center gap-2 font-bold"
            >
              <CalendarCheck /> Create Calendar
            </button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <button
              onClick={() => {
                setCreateEvent(true);
              }}
              className="flex items-center gap-2 font-bold"
            >
              <CalendarDays /> Create Event
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
