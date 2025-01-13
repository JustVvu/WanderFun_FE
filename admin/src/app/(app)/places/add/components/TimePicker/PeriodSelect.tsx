"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Period, display12HourValue, setDateByType } from "./TimePickerUtil";

export interface PeriodSelectorProps {
   period: Period;
   setPeriod: (m: Period) => void;
   date: Date | undefined;
   setDate: (date: Date | undefined) => void;
   onRightFocus?: () => void;
   onLeftFocus?: () => void;
}

export const TimePeriodSelect = React.forwardRef<HTMLButtonElement, PeriodSelectorProps>(({ period, setPeriod, date, setDate, onLeftFocus, onRightFocus }, ref) => {
   const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowRight") onRightFocus?.();
      if (e.key === "ArrowLeft") onLeftFocus?.();
   };

   const handleValueChange = (value: Period) => {
      setPeriod(value);

      /**
       * trigger an update whenever the user switches between AM and PM;
       * otherwise user must manually change the hour each time
       */
      if (date) {
         const tempDate = new Date(date);
         const hours = display12HourValue(date.getHours());
         setDate(setDateByType(tempDate, hours.toString(), "12hours", period === "AM" ? "PM" : "AM"));
      }
   };

   return (
      <div className="flex h-fit items-center">
         <Select defaultValue={period} onValueChange={(value: Period) => handleValueChange(value)}>
            <SelectTrigger ref={ref} className="w-[65px] bg-white3 focus:border-blue2" onKeyDown={handleKeyDown}>
               <SelectValue />
            </SelectTrigger>
            <SelectContent>
               <SelectItem className="focus:bg-blue2o focus:text-blue2 " value="PM">PM</SelectItem>
               <SelectItem className="focus:bg-blue2o focus:text-blue2" value="AM">AM</SelectItem>
            </SelectContent>
         </Select>
      </div>
   );
});

TimePeriodSelect.displayName = "TimePeriodSelect";