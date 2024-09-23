"use client";

import React, { useState } from "react";
import { CalendarCheck, CalendarDays, Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";

const createCalendarSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(200),
});

export const CreateButton = () => {
  const [createCalendar, setCreateCalendar] = useState<boolean>(false);
  const [createEvent, setCreateEvent] = useState<boolean>(false);

  const createCalendarForm = useForm<z.infer<typeof createCalendarSchema>>({
    resolver: zodResolver(createCalendarSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleCreateCalendar = (
    values: z.infer<typeof createCalendarSchema>,
  ) => {
    console.log(values);
  };

  return (
    <>
      <Dialog open={createCalendar} onOpenChange={setCreateCalendar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Calendar</DialogTitle>
          </DialogHeader>

          <Form {...createCalendarForm}>
            <form
              onSubmit={createCalendarForm.handleSubmit(handleCreateCalendar)}
            >
              <div className="flex flex-col gap-4">
                <FormField
                  control={createCalendarForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of Calendar" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the name of your calendar
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createCalendarForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of Calendar" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the name of your calendar
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Create Calendar</Button>
              </DialogFooter>
            </form>
          </Form>
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
