"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import * as placeAction from '@/app/actions/places-action'
import { Category, PlaceDescription, NewImage } from "@/types/place"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FormFieldInput } from "@/app/components/FormFieldInput"
import { ChevronLeft } from "lucide-react"
import { FormFieldCombobox } from "@/app/components/FormFieldComboBox"
import AddImageField from "./components/AddImageField"
import { TimePicker } from "./components/TimePicker/TimePicker"
import DescriptionInputField from "./components/DescriptionInputField"

const categoryOptions = Object.entries(Category).map(([key, value]) => ({
   label: value,
   value: key,
}));

const formSchema = z.object({
   name: z.string(),
   alternativeName: z.string(),
   address: z.string(),
   category: z.string(),
   operator: z.string(),
   description: z.array(z.object({
      title: z.string(),
      content: z.string(),
      imageUrl: z.string(),
      imagePublicId: z.string(),
   })),
   longitude: z.string(),
   latitude: z.string(),
   openTime: z.date(),
   closeTime: z.date(),
   checkInPoint: z.string(),
   checkInRange: z.string(),
   link: z.string(),
})

export default function AddPlace() {
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const router = useRouter()
   const [isUpdate, setIsUpdate] = useState(false);
   const [selectedImages, setSelectedImages] = useState<File[]>([]);
   const [updateImages, setUpdateImages] = useState<NewImage[]>([]);
   const [title, setTitle] = useState("Thêm địa điểm du lịch");
   const [descriptions, setDescriptions] = useState<PlaceDescription[]>([{ title: '', content: '', imageUrl: '', imagePublicId: '' }]);
   const [descriptionImages, setDescriptionImages] = useState<File[]>([]);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: "",
         alternativeName: "",
         address: "",
         operator: "",
         category: Category.OTHER,
         description: [],
         longitude: "",
         latitude: "",
         openTime: new Date(new Date().setHours(0, 0, 0, 0)),
         closeTime: new Date(new Date().setHours(0, 0, 0, 0)),
         checkInPoint: "",
         checkInRange: "",
         link: "",
      },
   })

   useEffect(() => {
      const id = searchParams.get('id');
      if (id) {
         setTitle("Chỉnh sửa địa điểm du lịch");
         setIsUpdate(true);
         const fetchData = async () => {
            const fetchedData = await placeAction.getPlaceById(id);
            //console.log(fetchedData);
            if (fetchedData) {
               form.reset({
                  name: fetchedData.name,
                  alternativeName: fetchedData.alternativeName,
                  address: fetchedData.address,
                  category: fetchedData.category,
                  operator: fetchedData.operator,
                  description: fetchedData.description,
                  longitude: fetchedData.longitude.toString(),
                  latitude: fetchedData.latitude.toString(),
                  openTime: fetchedData.openTime ? new Date(fetchedData.openTime) : new Date(new Date().setHours(0, 0, 0, 0)),
                  closeTime: fetchedData.closeTime ? new Date(fetchedData.closeTime) : new Date(new Date().setHours(0, 0, 0, 0)),
                  checkInPoint: fetchedData.checkInPoint.toString(),
                  checkInRange: fetchedData.checkInRange.toString(),
                  link: fetchedData.link,
               });
               setUpdateImages(fetchedData.placeImages);
               setDescriptions(fetchedData.description);
            }
         }
         fetchData();
      }
   }, [pathname, searchParams, form])

   useEffect(() => {
      form.setValue('description', descriptions);
   }, [descriptions, form]);

   const handleSendData = async (data: z.infer<typeof formSchema>) => {
      //console.log("Form data: ", data);

      if (isUpdate) {
         await placeAction.updatePlace(
            searchParams.get('id') as string,
            {
               ...data,
               category: data.category as Category,
               //openTime: data.openTime.toISOString(),
               //closeTime: data.closeTime.toISOString(),
            },
            selectedImages,
            descriptionImages
         );
         router.push('/places');
      } else {
         await placeAction.addPlace({
            ...data,
            category: data.category as Category,
            //openTime: data.openTime.toISOString(),
            //closeTime: data.closeTime.toISOString(),
         },
            selectedImages,
            descriptionImages
         );
         router.push('/places');
      }
   }


   return (
      <div className="m-[24px] p-[20px] rounded-2xl bg-white">
         <div className='flex flex-col justify-between items-center space-y-[24px] '>

            <div className="flex flex-row self-start items-center space-x-3">
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push('/places')}
                  className="border-[2px] rounded-full"
               >
                  <ChevronLeft />
               </Button>
               <h1 className='text-[20px] text-blue3 font-medium'>{title}</h1>
            </div>

            <h1 className='text-[28px] text-black3 font-semibold'>Nhập thông tin địa điểm</h1>
            <Separator className=" bg-black1" />

            <Form {...form}>
               <form
                  className='flex flex-col w-full h-fit px-[40px] space-y-[24px]'
                  onSubmit={form.handleSubmit(handleSendData)}
               >
                  <div className='grid grid-cols-3 col-auto w-full gap-x-[100px] gap-y-[24px] px-[40px]'>
                     <FormFieldInput
                        control={form.control}
                        name="name"
                        label="Tên địa điểm"
                        placeholder="Nhập tên địa điểm"
                     />
                     <FormFieldInput
                        control={form.control}
                        name="alternativeName"
                        label="Tên gọi khác"
                        placeholder="Nhập tên gọi khác"
                     />
                     <FormFieldInput
                        control={form.control}
                        name="address"
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ"
                     />
                     <FormFieldInput
                        control={form.control}
                        name="operator"
                        label="Đại diện quản lý"
                        placeholder="Nhập đại diện quản lý"
                     />
                     <FormFieldInput
                        control={form.control}
                        name="longitude"
                        label="Kinh độ"
                        placeholder="Nhập Kinh độ"
                     />
                     <FormFieldInput
                        control={form.control}
                        name="latitude"
                        label="Vĩ độ"
                        placeholder="Nhập vĩ độ"
                     />

                     <FormField
                        control={form.control}
                        name="openTime"
                        render={({ field }) => (
                           <FormItem className="flex flex-col">
                              <FormLabel className="text-left">Giờ mở cửa (Giờ/Phút)</FormLabel>
                              <FormControl>
                                 <TimePicker
                                    setDate={field.onChange}
                                    date={field.value}
                                 />
                              </FormControl>
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="closeTime"
                        render={({ field }) => (
                           <FormItem className="flex flex-col">
                              <FormLabel className="text-left">Giờ đóng cửa (Giờ/Phút)</FormLabel>
                              <FormControl>
                                 <TimePicker
                                    setDate={field.onChange}
                                    date={field.value}
                                 />
                              </FormControl>
                           </FormItem>
                        )}
                     />

                     <FormFieldCombobox
                        control={form.control}
                        name="category"
                        label="Phân loại địa điểm"
                        options={categoryOptions}
                        placeholder="Loại địa điểm"
                     />

                     <FormFieldInput
                        control={form.control}
                        name="checkInRange"
                        label="Khoảng cách Check-in (m)"
                        placeholder=""
                     />

                     <FormFieldInput
                        control={form.control}
                        name="checkInPoint"
                        label="Điểm số Check-in"
                        placeholder=""
                     />

                  </div>

                  <DescriptionInputField
                     descriptions={descriptions}
                     setDescriptions={setDescriptions}
                     setDescriptionImages={setDescriptionImages}
                  />

                  <AddImageField
                     selectedImages={selectedImages}
                     setSelectedImages={setSelectedImages}
                     updateImage={updateImages.map((image) => image.imageUrl)}
                  />
                  <Separator className=" bg-black1" />
                  <Button
                     className="h-[40px] w-fit self-center mt-[20px] bg-green3 text-white1 hover:bg-green_selected"
                     type="submit">
                     Lưu thông tin
                  </Button>
               </form>

            </Form>

         </div>
      </div >
   )
}
