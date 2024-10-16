"use client";

import { toast } from "sonner";
import { Edit, EllipsisVertical, LoaderCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { trpc } from "@/client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const toggleCalendar = trpc.calendar.toggle.useMutation({
    onSuccess() {
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
          <LoaderCircle className="h-4 w-4 animate-spin" />
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="space-x-1">
            <Edit className="aspect-square w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="space-x-1">
            <Trash className="aspect-square w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
