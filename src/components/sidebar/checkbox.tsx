"use client";

import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { trpc } from "@/client";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div className="flex items-center space-x-2">
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
  );
};
