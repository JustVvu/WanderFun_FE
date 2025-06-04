/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldInputProps {
   control?: Control<any>;
   name: string;
   label?: string;
   placeholder?: string;
   type?: string;
   value?: string;
   disabled?: boolean;
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormFieldInput: React.FC<FormFieldInputProps> = ({
   control,
   name,
   label,
   placeholder,
   type,
   value,
   disabled,
   onChange,
}) => {
   if (control) {
      return (
         <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
               <FormItem className="flex flex-col focus-within:text-blue2">
                  <FormLabel
                     className={`truncate 
                     ${error ? "text-red-500" : "text-gray-700"}`}
                  >
                     {label}
                  </FormLabel>
                  <FormControl
                     className="w-auto h-[40px] border-none bg-white3
                        focus:bg-white"
                  >
                     <Input
                        {...field}
                        type={type}
                        disabled={disabled}
                        placeholder={placeholder}
                        className="focus-visible:ring-blue2"
                     />
                  </FormControl>
                  <FormMessage
                     className={` ml-2
                        ${error ? "text-red-500" : "invisible"}`
                     }
                  >
                     {error?.message}
                  </FormMessage>
               </FormItem>
            )}
         />
      );
   }

   return (
      <FormItem className="flex flex-col justify-between focus-within:text-blue2">
         <FormLabel>{label}</FormLabel>
         <FormControl
            className="w-auto h-[40px] border-none bg-white3
                        focus:bg-white"
         >
            <Input
               name={name}
               type={type}
               placeholder={placeholder}
               value={value}
               onChange={onChange}
               className="focus-visible:ring-blue2"
            />
         </FormControl>
      </FormItem>
   );
};