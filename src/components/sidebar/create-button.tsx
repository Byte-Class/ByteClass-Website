"use client";

import React, { useState } from "react";
import { CalendarCheck, CalendarDays, LoaderCircle, Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { CalendarValidator } from "@/core/types/validators";
import { trpc } from "@/client/index";

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
import { Input } from "@/components/ui/input";

export const CreateButton = () => {
  const [createCalendar, setCreateCalendar] = useState<boolean>(false);
  const [createEvent, setCreateEvent] = useState<boolean>(false);

  const createForm = trpc.calendar.create.useMutation({
    onSuccess() {
      toast.success("Successfully Created Calendar");
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const createCalendarForm = useForm<z.infer<typeof CalendarValidator>>({
    resolver: zodResolver(CalendarValidator),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleCreateCalendar = (values: z.infer<typeof CalendarValidator>) => {
    createForm.mutate({
      name: values.name,
      description: values.description,
    });
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
                <Button disabled={createForm.isLoading} type="submit">
                  {createForm.isLoading && (
                    <LoaderCircle className="animate-spin" />
                  )}{" "}
                  Create Calendar
                </Button>
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
