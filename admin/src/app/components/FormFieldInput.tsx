/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller } from "react-hook-form";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldInputProps {
   control: Control<any>;
   name: string;
   label: string;
   placeholder: string;
   type?: string;
}

export const FormFieldInput: React.FC<FormFieldInputProps> = ({
   control,
   name,
   label,
   placeholder,
   type = "text",
}) => {
   return (
      <Controller
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className="flex flex-col justify-between focus-within:text-blue2">
               <FormLabel>{label}</FormLabel>
               <FormControl
                  className="w-auto h-[40px] border-none bg-white3
                      focus:bg-white"
               >
                  <Input
                     {...field}
                     type={type}
                     placeholder={placeholder}
                     className="focus-visible:ring-blue2"
                  />
               </FormControl>
            </FormItem>
         )}
      />
   );
};