"use client";

import { getHours, getMinutes } from "date-fns";
import { useEffect, useRef, useState } from "react";

const UPDATE_TIME = 1000 * 60; // 10 minutes

// Component to show the current time of the day.
export const CurrentTimeIndicator = () => {
  const div = useRef<null | HTMLDivElement>(null);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    if (div.current) div.current.scrollIntoView();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), UPDATE_TIME);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const top = getHours(now) * 64 + (getMinutes(now) / 60) * 64;

  return (
    <div
      className="relative w-full"
      style={{
        top: `${top}px`,
      }}
      ref={div}
    >
      <div className="absolute left-0 h-4 w-4 -translate-y-[6px] rounded-full bg-red-700"></div>
      <div className="h-1 w-full rounded-lg bg-red-700"></div>
    </div>
  );
};
