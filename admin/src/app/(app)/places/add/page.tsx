"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import * as placeAction from '@/app/actions/places-action'
import { PlaceDescription, NewImage } from "@/models/place"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FormFieldInput } from "@/app/components/FormFieldInput"
import { ChevronLeft, PlusCircle } from "lucide-react"
import { FormFieldCombobox } from "@/app/components/FormFieldComboBox"
import AddImageField from "./components/AddImageField"
import { TimePicker } from "./components/TimePicker/TimePicker"
import DescriptionInputField from "./components/DescriptionInputField"
import { fetchDataPlaceDetailByCoordinates } from "@/app/actions/map-action"
import { toast } from "sonner"
import { parseTimeString } from "@/helpers/convertHelper"
import { Switch } from "@/components/ui/switch"
import { useLoading } from "@/contexts/LoadingContext"
import CreateCategoryModal from "./components/CreateCategoryModal"
import { PlaceCategory } from "@/models/placeCategory"
import { getAllPlaceCategories } from "@/app/actions/place-categories-action"

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
   timeOpen: z.date(),
   timeClose: z.date(),
   openAllDay: z.boolean(),
   closing: z.boolean(),
   checkInPoint: z.string(),
   checkInRange: z.string(),
   link: z.string(),
})



export default function AddPlace() {
   // const { setLoadingState } = useLoading()
   // const pathname = usePathname()
   // const searchParams = useSearchParams()
   // const router = useRouter()
   // const [isUpdate, setIsUpdate] = useState(false);
   // const [selectedImages, setSelectedImages] = useState<File[]>([]);
   // const [updateImages, setUpdateImages] = useState<NewImage[]>([]);
   // const [title, setTitle] = useState("Thêm địa điểm du lịch");
   // const [descriptions, setDescriptions] = useState<PlaceDescription[]>([{ title: '', content: '', imageUrl: '', imagePublicId: '' }]);
   // const [descriptionImages, setDescriptionImages] = useState<File[]>([]);
   // const [categoryList, setCategoryList] = useState<PlaceCategory[]>([]);
   // const [isModalOpen, setModalOpen] = useState(false);

   // const form = useForm<z.infer<typeof formSchema>>({
   //    resolver: zodResolver(formSchema),
   //    defaultValues: {
   //       name: "",
   //       alternativeName: "",
   //       address: "",
   //       operator: "",
   //       category: "",
   //       description: [],
   //       longitude: "",
   //       latitude: "",
   //       timeOpen: new Date(new Date().setHours(0, 0, 0, 0)),
   //       timeClose: new Date(new Date().setHours(0, 0, 0, 0)),
   //       openAllDay: true,
   //       closing: false,
   //       checkInPoint: "",
   //       checkInRange: "",
   //       link: "",
   //    },
   // })

   // useEffect(() => {
   //    const fetchCategories = async () => {
   //       try {
   //          const fetchedCategories = await getAllPlaceCategories();
   //          setCategoryList(fetchedCategories);
   //       } catch (error) {
   //          toast.error(error + " :Không thể tải danh sách phân loại địa điểm");
   //       }
   //    };

   //    fetchCategories(); // Fetch categories when the page loads
   // }, []);

   // useEffect(() => {
   //    const id = searchParams.get('id');
   //    const lat = searchParams.get('lat');
   //    const lng = searchParams.get('lng');
   //    if (id) {
   //       setTitle("Chỉnh sửa địa điểm du lịch");
   //       setIsUpdate(true);
   //       const fetchData = async () => {
   //          const fetchedData = await placeAction.getPlaceById(id);
   //          console.log("fetchedData: ", parseTimeString(fetchedData.timeOpen));
   //          if (fetchedData) {
   //             form.reset({
   //                name: fetchedData.name,
   //                alternativeName: fetchedData.alternativeName,
   //                address: fetchedData.address,
   //                category: fetchedData.category.name,
   //                operator: fetchedData.operator,
   //                description: fetchedData.description,
   //                longitude: fetchedData.longitude.toString(),
   //                latitude: fetchedData.latitude.toString(),
   //                timeOpen: fetchedData.timeOpen ? parseTimeString(fetchedData.timeOpen) : new Date(new Date().setHours(0, 0, 0, 0)),
   //                timeClose: fetchedData.timeClose ? parseTimeString(fetchedData.timeClose) : new Date(new Date().setHours(0, 0, 0, 0)),
   //                openAllDay: fetchedData.openAllDay,
   //                closing: fetchedData.closing,
   //                checkInPoint: fetchedData.checkInPoint.toString(),
   //                checkInRange: fetchedData.checkInRange.toString(),
   //                link: fetchedData.link,
   //             });
   //             console.log("form:", form.getValues());
   //             setUpdateImages(fetchedData.placeImages);
   //             setDescriptions(fetchedData.description);
   //          }
   //       }
   //       fetchData();
   //    }
   //    if (lat && lng) {
   //       const fetchGeocodeData = async () => {
   //          try {
   //             await fetchDataPlaceDetailByCoordinates(lat, lng, (result) => {
   //                form.setValue('longitude', lng);
   //                form.setValue('latitude', lat);
   //                form.setValue('address', result[0]?.formatted_address || '');
   //             });
   //          } catch {
   //             toast.error('Không thể lấy thông tin địa chỉ từ tọa độ');
   //          }
   //       };
   //       fetchGeocodeData();
   //    }
   // }, [pathname, searchParams, form]);


   // useEffect(() => {
   //    form.setValue('description', descriptions);
   // }, [descriptions, form]);

   // // const handleSendData = async (data: z.infer<typeof formSchema>) => {
   // //    //console.log("Form data: ", data);
   // //    setLoadingState(true);
   // //    if (data.openAllDay) {
   // //       data.timeOpen = new Date(new Date().setHours(0, 0, 0, 0));
   // //       data.timeClose = new Date(new Date().setHours(23, 59, 59, 0));
   // //    }
   // //    try {
   // //       if (isUpdate) {
   // //          await placeAction.updatePlace(
   // //             searchParams.get('id') as string,
   // //             {
   // //                ...data,
   // //                categoryId: data.category,
   // //                // timeOpen: data.timeOpen.toLocaleTimeString(
   // //                //    'vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }
   // //                // ),
   // //                // timeClose: data.timeClose.toLocaleTimeString(
   // //                //    'vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }
   // //                // ),
   // //             },
   // //             //selectedImages,
   // //             //descriptionImages
   // //          );
   // //          router.push('/places');
   // //       } else {
   // //          await placeAction.addPlace({
   // //             ...data,
   // //             categoryId: 1,
   // //             timeOpen: data.timeOpen.toLocaleTimeString(
   // //                'vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }
   // //             ),
   // //             timeClose: data.timeClose.toLocaleTimeString(
   // //                'vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }
   // //             ),
   // //          },
   // //             //selectedImages,
   // //             //descriptionImages
   // //          );
   // //          router.push('/places');
   // //       }
   // //    }
   // //    catch {
   // //       toast.error('Có lỗi xảy ra!');
   // //    }
   // //    finally {
   // //       setLoadingState(false);
   // //    }
   // // }


   // return (
   //    <div className="m-[24px] p-[20px] rounded-2xl bg-white">
   //       <div className='flex flex-col justify-between items-center space-y-[24px] '>

   //          <div className="flex flex-row self-start items-center space-x-3">
   //             <Button
   //                variant="outline"
   //                size="icon"
   //                onClick={() => router.back()}
   //                className="border-[2px] rounded-full"
   //             >
   //                <ChevronLeft />
   //             </Button>
   //             <h1 className='text-[20px] text-blue3 font-medium'>{title}</h1>
   //          </div>

   //          <h1 className='text-[28px] text-black3 font-semibold'>Nhập thông tin địa điểm</h1>
   //          <Separator className=" bg-black1" />

   //          <Form {...form}>
   //             <form
   //                className='flex flex-col w-full h-fit px-[40px] space-y-[24px]'
   //             //onSubmit={form.handleSubmit(handleSendData)}
   //             >
   //                <div className='grid grid-cols-3 col-auto w-full gap-x-[100px] gap-y-[24px] px-[40px]'>
   //                   <FormFieldInput
   //                      control={form.control}
   //                      name="name"
   //                      label="Tên địa điểm"
   //                      placeholder="Nhập tên địa điểm"
   //                   />
   //                   <FormFieldInput
   //                      control={form.control}
   //                      name="alternativeName"
   //                      label="Tên gọi khác"
   //                      placeholder="Nhập tên gọi khác"
   //                   />
   //                   <FormFieldInput
   //                      control={form.control}
   //                      name="address"
   //                      label="Địa chỉ"
   //                      placeholder="Nhập địa chỉ"
   //                   />
   //                   <FormFieldInput
   //                      control={form.control}
   //                      name="operator"
   //                      label="Đại diện quản lý"
   //                      placeholder="Nhập đại diện quản lý"
   //                   />
   //                   <FormFieldInput
   //                      control={form.control}
   //                      name="longitude"
   //                      label="Kinh độ"
   //                      placeholder="Nhập Kinh độ"
   //                      disabled={searchParams.get('lng') ? true : false}
   //                   />
   //                   <FormFieldInput
   //                      control={form.control}
   //                      name="latitude"
   //                      label="Vĩ độ"
   //                      placeholder="Nhập vĩ độ"
   //                      disabled={searchParams.get('lat') ? true : false}
   //                   />

   //                   <div className="flex flex-row justify-between space-x-3">
   //                      <div className="flex-1">
   //                         <FormFieldCombobox
   //                            control={form.control}
   //                            name="category"
   //                            label="Phân loại địa điểm"
   //                            options={categoryList.map((category) => ({
   //                               label: category.name,
   //                               value: category.id.toString(),
   //                            }))}
   //                            placeholder="Loại địa điểm"
   //                         />
   //                      </div>
   //                      <Button
   //                         onClick={() => {
   //                            setModalOpen(true)
   //                         }}
   //                         type="button"
   //                         variant="outline"
   //                         size="icon"
   //                         className="flex-2 self-end mb-1 shadow-none
   //                            text-blue2 border-none hover:bg-blue2 hover:text-white hover:border-none"
   //                      >
   //                         <PlusCircle />
   //                      </Button>
   //                      <CreateCategoryModal
   //                         isOpen={isModalOpen}
   //                         onChange={setModalOpen}
   //                      />
   //                   </div>

   //                   <FormFieldInput
   //                      control={form.control}
   //                      name="checkInRange"
   //                      label="Khoảng cách Check-in (m)"
   //                      placeholder=""
   //                   />

   //                   <FormFieldInput
   //                      control={form.control}
   //                      name="checkInPoint"
   //                      label="Điểm số Check-in"
   //                      placeholder=""
   //                   />

   //                   <div className="flex flex-row grid-cols-subgrid col-span-3 justify-between">
   //                      <FormField
   //                         control={form.control}
   //                         name="closing"
   //                         render={({ field }) => (
   //                            <FormItem className="flex flex-col">
   //                               <FormLabel className="text-left">Đang đóng của</FormLabel>
   //                               <FormControl>
   //                                  <Switch
   //                                     className="self-baseline data-[state=checked]:bg-blue2 data-[state=unchecked]:bg-white4"
   //                                     checked={field.value}
   //                                     onCheckedChange={field.onChange}
   //                                  />
   //                               </FormControl>
   //                            </FormItem>
   //                         )} />
   //                      <FormField
   //                         control={form.control}
   //                         name="openAllDay"
   //                         render={({ field }) => (
   //                            <FormItem className="flex flex-col">
   //                               <FormLabel className="text-left">Mở cửa cả ngày</FormLabel>
   //                               <FormControl>
   //                                  <Switch
   //                                     className="self-baseline data-[state=checked]:bg-blue2 data-[state=unchecked]:bg-white4"
   //                                     checked={field.value}
   //                                     onCheckedChange={field.onChange}
   //                                  />
   //                               </FormControl>
   //                            </FormItem>
   //                         )} />

   //                      <FormField
   //                         control={form.control}
   //                         name="timeOpen"
   //                         render={({ field }) => (
   //                            <FormItem className="flex flex-col">
   //                               <FormLabel className="text-left">Giờ mở cửa (Giờ/Phút)</FormLabel>
   //                               <FormControl>
   //                                  <TimePicker
   //                                     setDate={field.onChange}
   //                                     date={field.value}
   //                                     disabled={form.watch('openAllDay')}
   //                                  />
   //                               </FormControl>
   //                            </FormItem>
   //                         )}
   //                      />

   //                      <FormField
   //                         control={form.control}
   //                         name="timeClose"
   //                         render={({ field }) => (
   //                            <FormItem className="flex flex-col">
   //                               <FormLabel className="text-left">Giờ đóng cửa (Giờ/Phút)</FormLabel>
   //                               <FormControl>
   //                                  <TimePicker
   //                                     setDate={field.onChange}
   //                                     date={field.value}
   //                                     disabled={form.watch('openAllDay')}
   //                                  />
   //                               </FormControl>
   //                            </FormItem>
   //                         )}
   //                      />
   //                   </div>
   //                   <div className="grid-cols-subgrid col-span-2">
   //                      <FormFieldInput
   //                         control={form.control}
   //                         name="link"
   //                         label="Đường dẫn đến trang địa điểm"
   //                         placeholder=""
   //                      />
   //                   </div>

   //                </div>

   //                <DescriptionInputField
   //                   descriptions={descriptions}
   //                   setDescriptions={setDescriptions}
   //                   setDescriptionImages={setDescriptionImages}
   //                />

   //                <AddImageField
   //                   selectedImages={selectedImages}
   //                   setSelectedImages={setSelectedImages}
   //                   updateImage={updateImages.map((image) => image.imageUrl)}
   //                />
   //                <Separator className=" bg-black1" />
   //                <Button
   //                   className="h-[40px] w-fit self-center mt-[20px] bg-green3 text-white1 hover:bg-green_selected"
   //                   type="submit">
   //                   Lưu thông tin
   //                </Button>
   //             </form>

   //          </Form>

   //       </div>
   //    </div >
   // )
}


