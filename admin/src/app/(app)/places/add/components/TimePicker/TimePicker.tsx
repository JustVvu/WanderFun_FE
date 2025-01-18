"use client";

import * as React from "react";
import { TimePickerInput } from "./TimePickerInput";
import { TimePeriodSelect } from "./PeriodSelect";
import { Period } from "./TimePickerUtil";
import { Label } from "@/components/ui/label";

interface TimePickerProps {
   date: Date | undefined;
   setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
   const [period, setPeriod] = React.useState<Period>("PM");

   const minuteRef = React.useRef<HTMLInputElement>(null);
   const hourRef = React.useRef<HTMLInputElement>(null);
   //const secondRef = React.useRef<HTMLInputElement>(null);
   //const periodRef = React.useRef<HTMLButtonElement>(null);

   React.useEffect(() => {
      if (date) {
         console.log("date", date);
         const hours = date.getHours();
         setPeriod(hours >= 12 ? "PM" : "AM");
      }
   }, [date]);

   return (
      <div className="flex items-end gap-2">
         <div className="grid gap-1 items-center text-center">
            <TimePickerInput
               picker="hours"
               id="hours12"
               period={period}
               date={date}
               setDate={setDate}
               ref={hourRef}
               onRightFocus={() => minuteRef.current?.focus()}
               onLeftFocus={() => minuteRef.current?.focus()}
            />
         </div>
         <div className="text-center self-center font-bold">
            :
         </div>
         <div className="grid gap-1 items-center text-center">
            <TimePickerInput
               picker="minutes"
               id="minutes12"
               date={date}
               setDate={setDate}
               ref={minuteRef}
               onLeftFocus={() => hourRef.current?.focus()}
               onRightFocus={() => hourRef.current?.focus()}
            />
         </div>
         {/* <div className="grid gap-1 text-center">
            <TimePeriodSelect
               period={period}
               setPeriod={setPeriod}
               date={date}
               setDate={setDate}
               ref={periodRef}
               onLeftFocus={() => secondRef.current?.focus()}
            />
         </div> */}
      </div>
   );
}