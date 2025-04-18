// app/places/components/PlaceForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormFieldInput } from "@/app/components/FormFieldInput";
import { ChevronLeft, PlusCircle } from "lucide-react";
import { FormFieldCombobox } from "@/app/components/FormFieldComboBox";
import { Switch } from "@/components/ui/switch";
import { useLoading } from "@/contexts/LoadingContext";

import AddImageField from "./AddImageField";
import { TimePicker } from "./TimePicker/TimePicker";
import SectionInputField from "./SectionInputField";
import CreateCategoryModal from "./CreateCategoryModal";
import ProvinceDistrictSelector from "./ProvinceDistrictSelector";

import { PlaceCategory } from "@/models/places/placeCategory";
import {
   placeFormSchema,
   PlaceFormValues,
   defaultFormValues,
   mapFormValuesToApiPayload
} from "../form-schema";
import * as placeAction from '@/app/actions/places/places-action';
import { fetchDataPlaceDetailByCoordinates } from "@/app/actions/map-action";
import { parseTimeString } from "@/helpers/convertHelper";
import { Section } from "@/models/places/section";

interface PlaceFormProps {
   isUpdate?: boolean;
   placeId?: string;
   lat?: string;
   lng?: string;
   categoryList: PlaceCategory[];
   onCategoryCreate?: () => Promise<void>;
}

export default function PlaceForm({
   isUpdate = false,
   placeId,
   lat,
   lng,
   categoryList,
   onCategoryCreate
}: PlaceFormProps) {
   const { setLoadingState } = useLoading();
   const router = useRouter();
   const [title, setTitle] = useState(isUpdate ? "Chỉnh sửa địa điểm du lịch" : "Thêm địa điểm du lịch");
   const [selectedImages, setSelectedImages] = useState<File[]>([]);
   const [updateImages, setUpdateImages] = useState<NewImage[]>([]);
   const [sections, setSections] = useState<Section[]>([
      { title: '', content: '', imageUrl: '', imagePublicId: '' }
   ]);
   const [sectionImages, setSectionImages] = useState<File[]>([]);
   const [isModalOpen, setModalOpen] = useState(false);

   const form = useForm<PlaceFormValues>({
      resolver: zodResolver(placeFormSchema),
      defaultValues: defaultFormValues,
   });

   // Load place data for update
   useEffect(() => {
      if (isUpdate && placeId) {
         const fetchData = async () => {
            try {
               setLoadingState(true);
               const fetchedData = await placeAction.getPlaceById(placeId);

               if (fetchedData) {
                  form.reset({
                     name: fetchedData.name,
                     categoryId: fetchedData.category.id.toString(),
                     address: {
                        provinceCode: fetchedData.address.province.code || "",
                        districtCode: fetchedData.address.district.code || "",
                        wardCode: fetchedData.address.ward.code || "",
                        street: fetchedData.address || "",
                     },
                     longitude: fetchedData.longitude.toString(),
                     latitude: fetchedData.latitude.toString(),
                     coverImage: {
                        imageUrl: fetchedData.coverImage?.imageUrl || "",
                        imagePublicId: fetchedData.coverImage?.imagePublicId || "",
                     },
                     placeDetail: {
                        description: fetchedData.placeDetail.description || "",
                        checkInPoint: fetchedData.placeDetail.checkInPoint?.toString() || "",
                        checkInRangeMeter: fetchedData.placeDetail.checkInRangeMeter || "",
                        timeOpen: fetchedData.placedetimeOpen ? parseTimeString(fetchedData.timeOpen) : new Date(new Date().setHours(0, 0, 0, 0)),
                        timeClose: fetchedData.timeClose ? parseTimeString(fetchedData.timeClose) : new Date(new Date().setHours(0, 0, 0, 0)),
                        isClosed: fetchedData.placeDetail.isClosed || false,
                        bestTimeToVisit: fetchedData.placeDetail.bestTimeToVisit || "",
                        priceRangeTop: fetchedData.placeDetail.priceRangeTop?.toString() || "",
                        priceRangeBottom: fetchedData.placeDetail.priceRangeBottom?.toString() || "",
                        isVerified: fetchedData.placeDetail.isVerified || false,
                        alternativeName: fetchedData.placeDetail.alternativeName || "",
                        operator: fetchedData.placeDetail.operator || "",
                        url: fetchedData.placeDetail.url || "",
                        sectionList: fetchedData.placeDetail.sectionList?.map(sect => ({
                           title: sect.title || "",
                           content: sect.content || "",
                           image: {
                              imageUrl: sect.image.imageUrl || "",
                              imagePublicId: sect.image.imagePublicId || "",
                           }
                        })) || [],
                     }
                  });
               }
            } catch (error) {
               toast.error(`Không thể tải thông tin địa điểm (${error})`);
            } finally {
               setLoadingState(false);
            }
         };

         fetchData();
      }
   }, [isUpdate, placeId, form, setLoadingState]);

   // Load coordinates data
   useEffect(() => {
      if (lat && lng) {
         const fetchGeocodeData = async () => {
            try {
               setLoadingState(true);
               await fetchDataPlaceDetailByCoordinates(lat, lng, (result) => {
                  form.setValue('longitude', lng);
                  form.setValue('latitude', lat);
                  form.setValue('address.street', result[0]?.formatted_address || '');
               });
            } catch (error) {
               toast.error(`Không thể lấy thông tin địa chỉ từ tọa độ (${error})`);
            } finally {
               setLoadingState(false);
            }
         };

         fetchGeocodeData();
      }
   }, [lat, lng, form, setLoadingState]);

   useEffect(() => {
      const mappedSections = sections.map(sect => ({
         title: sect.title,
         content: sect.content,
         image: {
            imageUrl: sect.imageUrl,
            imagePublicId: sect.imagePublicId
         }
      }));

      form.setValue('placeDetail.sectionList', mappedSections);
   }, [sections, form]);

   const handleSendData = async (data: PlaceFormValues) => {
      setLoadingState(true);

      try {
         const payload = mapFormValuesToApiPayload(data);

         if (isUpdate && placeId) {
            await placeAction.updatePlace(placeId, payload);
            toast.success('Cập nhật địa điểm thành công');
         } else {
            await placeAction.addPlace(payload);
            toast.success('Thêm địa điểm thành công');
         }

         router.push('/places');
      } catch (error) {
         toast.error('Có lỗi xảy ra khi lưu thông tin!');
         console.error(error);
      } finally {
         setLoadingState(false);
      }
   };

   const handleCategoryCreate = async () => {
      setModalOpen(false);
      if (onCategoryCreate) {
         await onCategoryCreate();
      }
   };

   return (
      <div className="m-[24px] p-[20px] rounded-2xl bg-white">
         <div className="flex flex-col justify-between items-center space-y-[24px]">
            <div className="flex flex-row self-start items-center space-x-3">
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.back()}
                  className="border-[2px] rounded-full"
               >
                  <ChevronLeft />
               </Button>
               <h1 className="text-[20px] text-blue3 font-medium">{title}</h1>
            </div>

            <h1 className="text-[28px] text-black3 font-semibold">Nhập thông tin địa điểm</h1>
            <Separator className="bg-black1" />

            <Form {...form}>
               <form
                  className="flex flex-col w-full h-fit px-[40px] space-y-[24px]"
                  onSubmit={form.handleSubmit(handleSendData)}
               >
                  <div className="grid grid-cols-3 col-auto w-full gap-x-[100px] gap-y-[24px] px-[40px]">
                     {/* Basic Information */}
                     <FormFieldInput
                        control={form.control}
                        name="name"
                        label="Tên địa điểm"
                        placeholder="Nhập tên địa điểm"
                     />

                     <FormFieldInput
                        control={form.control}
                        name="placeDetail.alternativeName"
                        label="Tên gọi khác"
                        placeholder="Nhập tên gọi khác"
                     />

                     <FormFieldInput
                        control={form.control}
                        name="address.street"
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ"
                     />

                     <FormFieldInput
                        control={form.control}
                        name="placeDetail.operator"
                        label="Đại diện quản lý"
                        placeholder="Nhập đại diện quản lý"
                     />

                     {/* Province and District Selector */}
                     <div className="col-span-3">
                        <ProvinceDistrictSelector
                           control={form.control}
                           provinceCodeName="address.provinceCode"
                           districtCodeName="address.districtCode"
                           wardCodeName="address.wardCode"
                        />
                     </div>

                     {/* Coordinates */}
                     <FormFieldInput
                        control={form.control}
                        name="longitude"
                        label="Kinh độ"
                        placeholder="Nhập Kinh độ"
                        disabled={!!lng}
                     />

                     <FormFieldInput
                        control={form.control}
                        name="latitude"
                        label="Vĩ độ"
                        placeholder="Nhập vĩ độ"
                        disabled={!!lat}
                     />

                     {/* Category */}
                     <div className="flex flex-row justify-between space-x-3">
                        <div className="flex-1">
                           <FormFieldCombobox
                              control={form.control}
                              name="categoryId"
                              label="Phân loại địa điểm"
                              options={categoryList.map((category) => ({
                                 label: category.name,
                                 value: category.id.toString(),
                              }))}
                              placeholder="Loại địa điểm"
                           />
                        </div>
                        <Button
                           onClick={() => setModalOpen(true)}
                           type="button"
                           variant="outline"
                           size="icon"
                           className="flex-2 self-end mb-1 shadow-none text-blue2 border-none hover:bg-blue2 hover:text-white hover:border-none"
                        >
                           <PlusCircle />
                        </Button>
                        <CreateCategoryModal
                           isOpen={isModalOpen}
                           onChange={setModalOpen}
                           onSuccess={handleCategoryCreate}
                        />
                     </div>

                     {/* Check-in settings */}
                     <FormFieldInput
                        control={form.control}
                        name="placeDetail.checkInRangeMeter"
                        label="Khoảng cách Check-in (m)"
                        placeholder="Nhập khoảng cách check-in"
                     />

                     <FormFieldInput
                        control={form.control}
                        name="placeDetail.checkInPoint"
                        label="Điểm số Check-in"
                        placeholder="Nhập điểm check-in"
                     />

                     {/* Opening Hours */}
                     <div className="flex flex-row grid-cols-subgrid col-span-3 justify-between">
                        <FormField
                           control={form.control}
                           name="placeDetail.isClosed"
                           render={({ field }) => (
                              <FormItem className="flex flex-col">
                                 <FormLabel className="text-left">Đang đóng cửa</FormLabel>
                                 <FormControl>
                                    <Switch
                                       className="self-baseline data-[state=checked]:bg-blue2 data-[state=unchecked]:bg-white4"
                                       checked={field.value}
                                       onCheckedChange={field.onChange}
                                    />
                                 </FormControl>
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="placeDetail.timeOpen"
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
                           name="placeDetail.timeClose"
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
                     </div>

                     {/* Price Range */}
                     <FormFieldInput
                        control={form.control}
                        name="placeDetail.priceRangeBottom"
                        label="Giá thấp nhất (VND)"
                        placeholder="Nhập giá thấp nhất"
                     />

                     <FormFieldInput
                        control={form.control}
                        name="placeDetail.priceRangeTop"
                        label="Giá cao nhất (VND)"
                        placeholder="Nhập giá cao nhất"
                     />

                     {/* Website */}
                     <FormFieldInput
                        control={form.control}
                        name="placeDetail.url"
                        label="Đường dẫn đến trang địa điểm"
                        placeholder="Nhập URL"
                     />
                  </div>

                  {/* Description Sections */}
                  <SectionInputField
                     sections={sections}
                     setSections={setSections}
                     setSectionImages={setSectionImages}
                  />

                  {/* Cover Images */}
                  <AddImageField
                     selectedImages={selectedImages}
                     setSelectedImages={setSelectedImages}
                     updateImage={updateImages.map((image) => image.imageUrl)}
                  />

                  <Separator className="bg-black1" />

                  <Button
                     className="h-[40px] w-fit self-center mt-[20px] bg-green3 text-white1 hover:bg-green_selected"
                     type="submit"
                  >
                     Lưu thông tin
                  </Button>
               </form>
            </Form>
         </div>
      </div>
   );
}