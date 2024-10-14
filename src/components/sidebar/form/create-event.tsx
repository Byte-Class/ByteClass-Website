"use client";

import { useForm } from "react-hook-form";
import {
  eachMinuteOfInterval,
  endOfDay,
  format,
  formatISO,
  startOfDay,
} from "date-fns";
import { z } from "zod";
import { CalendarDays, Check, ChevronDown, LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { EventValidator } from "@/core/types/validators";
import { TCalendar } from "@/core/db/types";
import { COLOURS } from "@/core/data/colours";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";
import { trpc } from "@/client";
import { useRouter } from "next/navigation";

const times = eachMinuteOfInterval({
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
});

export const CreateEventForm = ({ calendars }: { calendars: TCalendar[] }) => {
  const router = useRouter();

  const createEventForm = useForm<z.infer<typeof EventValidator>>({
    resolver: zodResolver(EventValidator),
    defaultValues: {
      name: "",
      description: "",
      location: "",
    },
  });

  const createEvent = trpc.event.create.useMutation({
    onSuccess() {
      toast.success("Successfully Created Event");
      createEventForm.reset();
      router.refresh();
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const handleCreateEvent = (values: z.infer<typeof EventValidator>) => {
    createEvent.mutate({
      name: values.name,
      description: values.description,
      location: values.location,
      day: formatISO(values.day),
      start: formatISO(values.start),
      end: formatISO(values.end),
      colour: values.colour,
      calendar: values.calendar,
    });
  };

  return (
    <Form {...createEventForm}>
      <form onSubmit={createEventForm.handleSubmit(handleCreateEvent)}>
        <div className="flex flex-col gap-4">
          {/* Name */}
          <FormField
            control={createEventForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name of Event" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={createEventForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description of Event" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            {/* Day */}
            <FormField
              control={createEventForm.control}
              name="day"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Day</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarDays className="ml-auto text-base opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Starting Time */}
            <FormField
              control={createEventForm.control}
              name="start"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>From</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? format(
                                times.find((time) => {
                                  return (
                                    time.valueOf() === field.value.valueOf()
                                  );
                                }) ?? "",
                                "p",
                              )
                            : "Select Start"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search Time" />
                        <CommandList>
                          <CommandEmpty>No event Time Specified</CommandEmpty>
                          <CommandGroup>
                            {times.map((time) => (
                              <CommandItem
                                value={format(time, "p")}
                                key={time.toISOString()}
                                onSelect={() => {
                                  createEventForm.setValue("start", time);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 text-base text-white",
                                    time.valueOf() === field.value?.valueOf()
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {format(time, "p")}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ending Time */}
            <FormField
              control={createEventForm.control}
              name="end"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? format(
                                times.find((time) => {
                                  return (
                                    time.valueOf() === field.value.valueOf()
                                  );
                                }) ?? "",
                                "p",
                              )
                            : "Select End"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search Time" />
                        <CommandList>
                          <CommandEmpty>No event Time Specified</CommandEmpty>
                          <CommandGroup>
                            {times.map((time) => (
                              <CommandItem
                                value={format(time, "p")}
                                key={time.toISOString()}
                                onSelect={() => {
                                  createEventForm.setValue("end", time);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 text-base text-white",
                                    time.valueOf() === field.value?.valueOf()
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {format(time, "p")}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* location */}
          <FormField
            control={createEventForm.control}
            name="location"
            render={({ field }) => (
              <FormItem className="mt-0">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Location of Event" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Colour */}
          <FormField
            control={createEventForm.control}
            name="colour"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Colours</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? COLOURS.find(
                              (colour) => colour.value === field.value,
                            )?.label
                          : "Select Colour"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search language..." />
                      <CommandList>
                        <CommandEmpty>No colour found.</CommandEmpty>
                        <CommandGroup>
                          {COLOURS.map((colour) => (
                            <CommandItem
                              value={colour.label}
                              key={colour.value}
                              onSelect={() => {
                                createEventForm.setValue(
                                  "colour",
                                  colour.value,
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 text-base text-white",
                                  colour.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {colour.label}
                              <div
                                className="ml-2 h-4 w-4 rounded-full"
                                style={{ backgroundColor: `#${colour.value}` }}
                              ></div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Calendar */}
          <FormField
            control={createEventForm.control}
            name="calendar"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Calendar</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? calendars.find((calendar) => {
                              return calendar.id === field.value;
                            })?.name
                          : "Select Calendar"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search Calendars..." />
                      <CommandList>
                        <CommandEmpty>No Calendars Found</CommandEmpty>
                        <CommandGroup>
                          {calendars.map((calendar) => (
                            <CommandItem
                              value={calendar.name}
                              key={calendar.id}
                              onSelect={() => {
                                createEventForm.setValue(
                                  "calendar",
                                  calendar.id,
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  calendar.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {calendar.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button disabled={false} type="submit">
            {false && <LoaderCircle className="mr-2 animate-spin" />} Create
            Event
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
