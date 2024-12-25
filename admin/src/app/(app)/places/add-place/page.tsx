"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FormFieldInput } from "@/app/components/FormFieldInput"
import { ChevronLeft } from "lucide-react"
import { FormFieldCombobox } from "@/app/components/FormFieldComboBox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import AddImageField from "./components/AddImageField"
import { useRouter } from "next/navigation"
import { TimePicker } from "./components/TimePicker/TimePicker"

const options = [
   { label: "Option 1", value: "1" },
   { label: "Option 2", value: "2" },
   { label: "Option 3", value: "3" },
   { label: "Option 4", value: "4" },
];

const formSchema = z.object({
   name: z.string(),
   alternativeName: z.string(),
   address: z.string(),
   category: z.string(),
   operator: z.string(),
   longitude: z.number(),
   latitude: z.number(),
   openTime: z.date(),
   closeTime: z.date(),
   checkInPoint: z.number(),
   checkInRange: z.number(),
   link: z.string(),
})

export default function AddPlace() {
   const router = useRouter()
   const [selectedImages, setSelectedImages] = useState<File[]>([]);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: "",
         alternativeName: "",
         address: "",
         category: "",
         operator: "",
         longitude: 0,
         latitude: 0,
         openTime: new Date(new Date().setHours(0, 0, 0, 0)),
         closeTime: new Date(new Date().setHours(0, 0, 0, 0)),
         checkInPoint: 0,
         checkInRange: 0,
         link: "",
      },
   })


   const handleSendData = async (data: z.infer<typeof formSchema>) => {
      const sendData = { data, images: selectedImages }
      console.log(sendData)
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
               <h1 className='text-[20px] text-blue3 font-medium'>Thêm địa điểm du lịch</h1>
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
                     <FormFieldCombobox
                        control={form.control}
                        name="province"
                        label="Thành phố/Tỉnh"
                        options={options}
                        placeholder="Chọn Thành phố/Tỉnh"
                     />
                     <FormFieldCombobox
                        control={form.control}
                        name="district"
                        label="Quận/Huyện"
                        options={options}
                        placeholder="Chọn Quận/Huyện"
                     />
                     <FormFieldCombobox
                        control={form.control}
                        name="ward"
                        label="Phường/Xã"
                        options={options}
                        placeholder="Chọn Phường/Xã"
                     />
                     <FormFieldInput
                        control={form.control}
                        name="address"
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ"
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
                        options={options}
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

                  <div className="w-full px-[40px] focus-within:text-blue2">
                     <Label htmlFor="description">Thông tin giới thiệu</Label>
                     <Textarea
                        placeholder="Nhập thông tin giới thiệu địa điểm"
                        id="description"
                        className="h-[120px] bg-white3 focus:bg-white focus:border-blue2"
                     />

                  </div>

                  <AddImageField selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
                  <Separator className=" bg-black1" />
                  <Button
                     className="h-[40px] w-fit self-center mt-[20px] bg-green3 text-white1 hover:bg-green_selected"
                     type="submit">
                     Thêm địa điểm
                  </Button>
               </form>

            </Form>

         </div>
      </div >
   )
}
