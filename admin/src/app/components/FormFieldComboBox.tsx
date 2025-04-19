/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FC } from "react";

import { Control, Controller } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import {
   FormControl,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FormFieldComboboxProps {
   control: Control<any>;
   name: string;
   label: string;
   options: { label: string; value: string }[];
   placeholder?: string;
   disabled?: boolean;
   onChange?: (value: string) => void;
}

export const FormFieldCombobox: FC<FormFieldComboboxProps> = ({
   control,
   name,
   label,
   options,
   placeholder = "Select an option",
   disabled,
   onChange,
}) => {

   const [open, setOpen] = useState(false)

   return (
      <Controller
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className="flex flex-col justify-between">
               <FormLabel>{label}</FormLabel>
               <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                     <FormControl>
                        <Button
                           disabled={disabled}
                           variant="outline"
                           role="combobox"
                           aria-expanded={open}
                           className={cn(
                              "w-auto h-[40px] justify-between border-none bg-white3 hover:bg-blue2o hover:text-blue2",
                              !field.value && "text-muted-foreground"
                           )}
                        >
                           {field.value
                              ? options.find((option) => option.value === field.value)?.label
                              : placeholder}
                           <ChevronsUpDown className="opacity-50" />
                        </Button>
                     </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                     <Command>
                        <CommandInput placeholder="Search..." className="h-9" />
                        <CommandList >
                           <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                           <CommandGroup>
                              {options.map((option) => (
                                 <CommandItem
                                    value={option.label}
                                    key={option.value}
                                    onSelect={() => {
                                       field.onChange(option.value);
                                       if (onChange) {
                                          onChange(option.value);
                                       }
                                       setOpen(false);
                                    }}
                                    className={cn("data-[selected=true]:bg-blue2o data-[selected=true]:text-blue2")}
                                 >
                                    {option.label}
                                    <Check
                                       className={cn(
                                          "ml-auto",
                                          option.value === field.value ? "opacity-100" : "opacity-0"
                                       )}
                                    />
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
   );
};