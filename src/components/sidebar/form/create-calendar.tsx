"use client";

import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { trpc } from "@/client";
import { CalendarValidator } from "@/core/types/validators";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const CreateCalendarForm = () => {
  const router = useRouter();

  const createCalendarForm = useForm<z.infer<typeof CalendarValidator>>({
    resolver: zodResolver(CalendarValidator),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createForm = trpc.calendar.create.useMutation({
    onSuccess() {
      toast.success("Successfully Created Calendar");
      createCalendarForm.reset();
      router.refresh();
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const handleCreateCalendar = (values: z.infer<typeof CalendarValidator>) => {
    createForm.mutate({
      name: values.name,
      description: values.description,
    });
  };

  return (
    <Form {...createCalendarForm}>
      <form onSubmit={createCalendarForm.handleSubmit(handleCreateCalendar)}>
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
                  <Input placeholder="Description of Calendar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button disabled={createForm.isLoading} type="submit">
            {createForm.isLoading ? (
              <>
                <LoaderCircle className="mr-1 w-4 animate-spin" /> Loading...
              </>
            ) : (
              "Create Calendar"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
