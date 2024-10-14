"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { TEvent } from "@/core/db/types";

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
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";

const UpdateEventValidator = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(1).max(200),
});

export const UpdateEventForm = ({ event }: { event: TEvent }) => {
  const updateEventForm = useForm<z.infer<typeof UpdateEventValidator>>({
    resolver: zodResolver(UpdateEventValidator),
    defaultValues: {
      name: event.name,
      description: event.description,
    },
  });

  function onSubmit(values: z.infer<typeof UpdateEventValidator>) {
    console.log(values);
  }

  return (
    <Form {...updateEventForm}>
      <form
        onSubmit={updateEventForm.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-4">
          <FormField
            control={updateEventForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={updateEventForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button disabled={false} type="submit">
            {false && <LoaderCircle className="mr-2 animate-spin" />} Create
            Calendar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
