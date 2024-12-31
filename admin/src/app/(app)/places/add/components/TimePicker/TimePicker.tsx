"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./TimePickerInput";
import { TimePeriodSelect } from "./PeriodSelect";
import { Period } from "./TimePickerUtil";

interface TimePickerProps {
   date: Date | undefined;
   setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
   const [period, setPeriod] = React.useState<Period>("PM");

   const minuteRef = React.useRef<HTMLInputElement>(null);
   const hourRef = React.useRef<HTMLInputElement>(null);
   const secondRef = React.useRef<HTMLInputElement>(null);
   const periodRef = React.useRef<HTMLButtonElement>(null);

   React.useEffect(() => {
      if (date) {
         const hours = date.getHours();
         setPeriod(hours >= 12 ? "PM" : "AM");
      }
   }, [date]);

   return (
      <div className="flex items-end gap-2">
         <div className="grid gap-1 text-center">
            <TimePickerInput
               picker="12hours"
               period={period}
               date={date}
               setDate={setDate}
               ref={hourRef}
               onRightFocus={() => minuteRef.current?.focus()}
            />
         </div>
         <div className="grid gap-1 text-center">
            <TimePickerInput
               picker="minutes"
               id="minutes12"
               date={date}
               setDate={setDate}
               ref={minuteRef}
               onLeftFocus={() => hourRef.current?.focus()}
               onRightFocus={() => secondRef.current?.focus()}
            />
         </div>
         <div className="grid gap-1 text-center">
            <TimePeriodSelect
               period={period}
               setPeriod={setPeriod}
               date={date}
               setDate={setDate}
               ref={periodRef}
               onLeftFocus={() => secondRef.current?.focus()}
            />
         </div>
      </div>
   );
}