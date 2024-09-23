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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const CreateButton = () => {
  const [createCalendar, setCreateCalendar] = useState<boolean>(false);
  const [createEvent, setCreateEvent] = useState<boolean>(false);

  return (
    <>
      <Dialog open={createCalendar} onOpenChange={setCreateCalendar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Calendar</DialogTitle>
          </DialogHeader>

          <div>
            <h2>Create Calendar Form</h2>
          </div>

          <DialogFooter>
            <Button>Create Calendar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createEvent} onOpenChange={setCreateEvent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>Create A Event</DialogDescription>
          </DialogHeader>
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
