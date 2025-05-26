/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FC } from "react";

import { Control, Controller } from "react-hook-form";
import { Check, ChevronsUpDown, Pencil, Trash2 } from "lucide-react";
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
import { useLoading } from "@/contexts/LoadingContext";
import * as placeCategoriesServices from "@/app/services/places/placeCategoriesServices";
import CreateCategoryModal from "./CreateCategoryModal";

interface CategoryComboBoxProps {
   control: Control<any>;
   name: string;
   label: string;
   options: { label: string; value: string }[];
   placeholder?: string;
   disabled?: boolean;
   onChange?: (value: string) => void;
   onCategoryChange?: () => void;
}

export const CategoryComboBox: FC<CategoryComboBoxProps> = ({
   control,
   name,
   label,
   options,
   placeholder = "Select an option",
   disabled,
   onChange,
   onCategoryChange,
}) => {

   const { setLoadingState } = useLoading()
   const [open, setOpen] = useState(false)
   const [isModalOpen, setModalOpen] = useState(false);
   const [editCategoryId, setEditCategoryId] = useState<string | null>(null);

   const handleDeleteCategory = async (categoryId: string) => {
      try {
         setLoadingState(true);
         await placeCategoriesServices.deletePlaceCategory(categoryId);
         if (onCategoryChange) onCategoryChange(); // Notify parent to reload data
      } catch (err) {
         console.log(err);
      } finally {
         setLoadingState(false);
      }
   };

   const handleUpdateCategory = (categoryId: string) => {
      setEditCategoryId(categoryId);
      setModalOpen(true);
   };

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
                                       console.log("Selected value:", option);
                                       setOpen(false);
                                    }}
                                    className={cn("data-[selected=true]:bg-blue2o data-[selected=true]:text-blue1")}
                                 >
                                    {option.label}
                                    <Check
                                       className={cn(
                                          "ml-auto",
                                          option.value === field.value ? "opacity-100" : "opacity-0"
                                       )}
                                    />
                                    <div className="flex items-center"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          //e.preventDefault(); // This is the missing part to prevent onSelect!
                                       }}
                                    >
                                       <Button
                                          onClick={() => handleUpdateCategory(option.value)}
                                          variant={"ghost"}
                                          size={"icon"}
                                          className="text-orange5 hover:text-orange2 hover:bg-transparent"
                                       >
                                          <Pencil className="h-4 w-4" />
                                       </Button>
                                       <Button
                                          onClick={() => {
                                             handleDeleteCategory(option.value);
                                          }}
                                          variant={"ghost"}
                                          size={"icon"}
                                          className="text-red4 hover:text-red2 hover:bg-transparent"
                                       >
                                          <Trash2 className="h-4 w-4" />
                                       </Button>
                                    </div>
                                 </CommandItem>
                              ))}
                           </CommandGroup>
                        </CommandList>
                     </Command>
                  </PopoverContent>
               </Popover>
               <FormMessage />
               <CreateCategoryModal
                  isOpen={isModalOpen}
                  onChange={(open) => {
                     setModalOpen(open);
                     if (!open) setEditCategoryId(null); // Reset after closing
                  }}
                  onSuccess={() => {
                     if (onCategoryChange) onCategoryChange(); // Refresh category list after update
                     setModalOpen(false);
                     setEditCategoryId(null);
                  }}
                  editCategoryId={editCategoryId || undefined}
               />
            </FormItem>
         )}
      />
   );
};