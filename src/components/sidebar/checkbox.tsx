"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Edit, EllipsisVertical, LoaderCircle, Trash } from "lucide-react";

import { trpc } from "@/client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

export const CheckBoxSidebar = ({
  id,
  text,
  active,
}: {
  id: string;
  text: string;
  active: boolean;
}) => {
  const router = useRouter();

  // state to open delete alert dialog
  const [open, setOpen] = useState<boolean>(false);

  // Toggle calendar TRPC endpoint
  const toggleCalendar = trpc.calendar.toggle.useMutation({
    onSuccess() {
      router.refresh();
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  // Delete calendar TRPC endpoint
  const deleteCalendar = trpc.calendar.delete.useMutation({
    onSuccess() {
      toast.success("Successfully deleted calendar");
      router.refresh();
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        {toggleCalendar.isLoading ? (
          <LoaderCircle className="w-4 animate-spin" />
        ) : (
          <Checkbox
            onClick={() => {
              toggleCalendar.mutate({ calendarId: id });
            }}
            checked={active}
          />
        )}
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {text}
        </label>
      </div>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <button className="flex items-center gap-2 font-bold">
              <Edit className="aspect-square w-4" />
              <span>Edit</span>
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button
              className="flex items-center gap-2 font-bold"
              onClick={() => {
                setOpen(true);
              }}
            >
              <Trash className="aspect-square w-4" />
              <span>Delete</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you SURE?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the calendar, and can not be
              retrieved again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCalendar.isLoading}>
              Cancel
            </AlertDialogCancel>

            <Button
              disabled={deleteCalendar.isLoading}
              onClick={() => {
                deleteCalendar
                  .mutateAsync({
                    id: id,
                  })
                  .then(() => setOpen(false));
              }}
            >
              {deleteCalendar.isLoading ? (
                <>
                  <LoaderCircle className="mr-1 w-4 animate-spin" /> Loading...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
