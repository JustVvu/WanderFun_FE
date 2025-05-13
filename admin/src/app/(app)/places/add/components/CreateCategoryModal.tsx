"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
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
import { PlaceCategoryCreatePayload } from "@/models/places/placeCategory"
import * as placeCategoryServices from "@/app/services/places/placeCategoriesServices"
import { Separator } from "@/components/ui/separator"

interface CreateCategoryModalProps {
   isOpen: boolean;
   onChange: (open: boolean) => void;
   onSuccess?: () => void;
   editCategoryId?: string; // Null means Create mode, otherwise Edit mode.
}

const formSchema = z.object({
   name: z.string().min(1, {
      message: "Tên phân loại không được để trống",
   }),
   nameEn: z.string().min(1, {
      message: "Tên phân loại không được để trống",
   }),

})

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
   isOpen,
   onChange,
   onSuccess,
   editCategoryId,
}) => {
   const [isSubmitting, setIsSubmitting] = useState(false)

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: "",
         nameEn: "",
      },
   });

   const loadCategoryData = async (id: string) => {
      try {
         const data = await placeCategoryServices.getPlaceCategoryById(id);
         form.reset({
            name: data.name,
            nameEn: data.nameEn,
         });
      } catch (error) {
         console.error(error);
         toast.error("Không thể tải dữ liệu phân loại.");
      };
   }

   useEffect(() => {
      if (editCategoryId && isOpen) {
         loadCategoryData(editCategoryId);
      } else {
         form.reset({ name: "", nameEn: "" });
      }
   }, [editCategoryId, isOpen, form]);

   const onSubmit = async (data: PlaceCategoryCreatePayload) => {
      setIsSubmitting(true);
      try {
         if (editCategoryId) {
            await placeCategoryServices.updatePlaceCategory(editCategoryId, data);
            toast.success("Cập nhật phân loại thành công!");
         } else {
            await placeCategoryServices.createPlaceCategory(data);
            toast.success("Thêm phân loại thành công!");
         }

         form.reset();
         onChange(false);

         if (onSuccess) onSuccess();
      } catch (error) {
         console.error(error);
         toast.error(`Đã xảy ra lỗi: ${error}`);
      } finally {
         setIsSubmitting(false);
      }
   };

   const isEditMode = Boolean(editCategoryId);


   return (
      <Dialog open={isOpen} onOpenChange={onChange}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader
               className="space-y-2 bottom-2 border-b-2 pb-3"
            >
               <DialogTitle>
                  {isEditMode ? "Chỉnh sửa phân loại" : "Thêm phân loại địa điểm"}
               </DialogTitle>
               <DialogDescription>
                  {isEditMode
                     ? "Chỉnh sửa thông tin phân loại địa điểm."
                     : "Tạo thêm phân loại cho địa điểm của bạn."}
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={(e) => {
                     e.preventDefault();  // Prevent default form submission
                     e.stopPropagation(); // Prevent event from bubbling up
                     onSubmit(form.getValues() as PlaceCategoryCreatePayload); // Manually call onSubmit with form values
                  }}
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
                     type="button"  // Change to button type
                     className="w-1/3 rounded-xl py-6 text-md font-semibold self-center
                              bg-blue2 hover:bg-blue3"
                     disabled={isSubmitting}
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Manually trigger form validation and submission
                        form.handleSubmit((data) => onSubmit(data as PlaceCategoryCreatePayload))(e);
                     }}
                  >
                     {isSubmitting ? (
                        <Loader2 className="animate-spin mr-2" />
                     ) : (
                        "Lưu thông tin"
                     )}
                  </Button>
               </form>
            </Form>
         </DialogContent>
      </Dialog >
   )
}


export default CreateCategoryModal;
