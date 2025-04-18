"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { FormFieldInput } from "@/app/components/FormFieldInput"
import { Loader2 } from "lucide-react"
import { PlaceCategoryPayload } from "@/models/placeCategory"
import { createPlaceCategory } from "@/app/actions/place-categories-action"
import { Separator } from "@/components/ui/separator"


interface CreateCategoryModalProps {
   isOpen: boolean;
   onChange: (open: boolean) => void;
   onModalSubmit?: () => void;
}

const formSchema = z.object({
   name: z.string(),
   nameEn: z.string(),

})

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
   isOpen,
   onChange,
   //onModalSubmit,
}) => {
   const [isSubmitting, setIsSubmitting] = useState(false)

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: "",
         nameEn: "",
      },
   });

   const onSubmit = async (data: PlaceCategoryPayload) => {
      setIsSubmitting(true); // Start loading spinner
      try {
         // if (selectedFile) {
         //    const uploadedAvatarUrl = await handleAvatarUpload(selectedFile);
         //    data.profilePicture = uploadedAvatarUrl;
         // }

         console.log("Update data: ", data);

         await createPlaceCategory(data);

         toast.success("Thêm phân loại thành công!");

         onChange(false);
         //onProfileUpdate?.();
      } catch (error) {
         console.error(error);
      } finally {
         setIsSubmitting(false); // Stop loading spinner
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={onChange}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader
               className="space-y-2 bottom-2 border-b-2 pb-3"
            >
               <DialogTitle>Thêm phân loại địa điểm</DialogTitle>
               <DialogDescription>
                  Tạo thêm phân loại cho địa điểm của bạn.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col space-y-4 mt-3"
                  autoComplete="off"
               >
                  <FormFieldInput
                     control={form.control}
                     name="name"
                     label="Tên phân loại (Tiếng Việt)"
                  />
                  <FormFieldInput
                     control={form.control}
                     name="nameEn"
                     label="Tên phân loại (Tiếng Anh)"
                  />

                  <Separator className="my-4" />

                  <Button
                     variant="default"
                     type="button"
                     className="w-1/3 rounded-xl py-6 text-md font-semibold self-center
                        bg-blue2 hover:bg-blue3"
                     disabled={isSubmitting} // Disable button when submitting
                  >
                     {isSubmitting ? (
                        <Loader2 className="animate-spin mr-2" /> // Show loading spinner
                     ) : (
                        "Tạo mới"
                     )}
                  </Button>
               </form>
            </Form>
         </DialogContent>
      </Dialog >
   )
}


export default CreateCategoryModal;
