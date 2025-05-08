// app/places/components/PlaceForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
} from "./PlaceFormSchema";
import * as placeAction from '@/app/services/places/placesServices';
import { fetchDataPlaceDetailByCoordinates } from "@/app/services/mapServices";
import { parseTimeString } from "@/helpers/convertHelper";
import { SectionDTO } from "@/models/places/section";
import { Textarea } from "@/components/ui/textarea";
import { getDistrictByNameAndProvinceCode, getProvinceByName, getWardByNameAndDistrictCode } from "@/app/services/addresses/addressServices";

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
   const title = isUpdate ? "Chỉnh sửa địa điểm du lịch" : "Thêm địa điểm du lịch";
   const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);
   const [coverImageDeleted, setCoverImageDeleted] = useState<boolean>(false);
   const [sections, setSections] = useState<SectionDTO[]>([
      { title: '', content: '', image: { id: 0, imageUrl: '', imagePublicId: '' } },
   ]);
   const [sectionImages, setSectionImages] = useState<File[]>([]);
   const [isModalOpen, setModalOpen] = useState(false);

   const form = useForm<PlaceFormValues>({
      resolver: zodResolver(placeFormSchema),
      defaultValues: defaultFormValues,
   });

   const { reset } = form;

   // Load place data for update
   useEffect(() => {
      if (!isUpdate || !placeId) return;
      const fetchPlaceData = async () => {
         try {
            setLoadingState(true);
            const fetchedData = await placeAction.getPlaceById(placeId);
            reset({
               name: fetchedData.name,
               longitude: fetchedData.longitude.toString(),
               latitude: fetchedData.latitude.toString(),
               address: {
                  provinceCode: fetchedData.address.province.code,
                  districtCode: fetchedData.address.district.code,
                  wardCode: fetchedData.address.ward?.code,
                  street: fetchedData.address.street?.toString(),
               },
               coverImage: {
                  imageUrl: fetchedData.coverImage?.imageUrl,
                  imagePublicId: fetchedData.coverImage?.imagePublicId,
               },
               categoryId: fetchedData.category.id.toString(),
               placeDetail: {
                  ...(fetchedData.placeDetail || {}),
                  checkInPoint: fetchedData.placeDetail?.checkInPoint.toString(),
                  checkInRangeMeter: fetchedData.placeDetail?.checkInRangeMeter.toString(),
                  timeOpen: fetchedData.placeDetail?.timeOpen
                     ? parseTimeString(fetchedData.placeDetail.timeOpen)
                     : new Date(new Date().setHours(0, 0, 0, 0)),
                  timeClose: fetchedData.placeDetail?.timeClose
                     ? parseTimeString(fetchedData.placeDetail.timeClose)
                     : new Date(new Date().setHours(0, 0, 0, 0)),
                  priceRangeTop: fetchedData.placeDetail?.priceRangeTop.toString(),
                  priceRangeBottom: fetchedData.placeDetail?.priceRangeBottom.toString(),
               }
            });
            setSections(fetchedData.placeDetail?.sectionList || []);
         } catch (error) {
            toast.error(`Không thể tải thông tin địa điểm (${error})`);
         } finally {
            setLoadingState(false);
         }
      };
      fetchPlaceData();
   }, [isUpdate, placeId, reset]);

   // Load coordinates data
   useEffect(() => {
      if (lat && lng) {
         const fetchGeocodeData = async () => {
            try {
               setLoadingState(true);
               form.setValue('longitude', lng);
               form.setValue('latitude', lat);
               await fetchDataPlaceDetailByCoordinates(lat, lng, async (result) => {
                  const province = await getProvinceByName(result[0]?.compound?.province);
                  form.setValue('address.provinceCode', province.code);

                  const district = await getDistrictByNameAndProvinceCode(result[0]?.compound?.district, province.code);
                  form.setValue('address.districtCode', district.code);

                  const ward = await getWardByNameAndDistrictCode(result[0]?.compound?.commune, district.code);
                  form.setValue('address.wardCode', ward.code);
               });
            } catch (error) {
               toast.error(`Không thể lấy thông tin địa chỉ từ tọa độ (${error})`);
            } finally {
               setLoadingState(false);
            }
         };

         fetchGeocodeData();
      }
   }, [lat, lng, form]);

   useEffect(() => {
      const mappedSections = sections.map(sect => ({
         title: sect.title,
         content: sect.content,
         image: {
            imageUrl: sect.image?.imageUrl,
            imagePublicId: sect.image?.imagePublicId
         }
      }));

      form.setValue('placeDetail.sectionList', mappedSections);
   }, [sections, form]);

   const handleSendData = async (data: PlaceFormValues) => {
      console.log("Form data: ", data);
      setLoadingState(true);

      try {
         const payload = mapFormValuesToApiPayload(data);
         console.log("Sent payload: ", payload);

         if (isUpdate && placeId) {
            await placeAction.updatePlace(placeId, payload, selectedCoverImage, sectionImages);
            toast.success('Cập nhật địa điểm thành công');
         } else {
            await placeAction.addPlace(payload, selectedCoverImage, sectionImages);
            toast.success('Thêm địa điểm thành công');
         }

         //router.push('/places');
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
                  onSubmit={(e) => {
                     e.preventDefault();
                     console.log("Form data: ", form.getValues());
                     form.handleSubmit(handleSendData)();
                  }}
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
                           className="h-[40px] w-[40px] flex-2 self-center shadow-none text-blue2 border-blue2 hover:bg-blue2 hover:text-white hover:border-none"
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
                     <div className="grid grid-cols-2 gap-4 col-span-1">
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
                     </div>

                     {/* Opening Hours */}
                     <div className="grid grid-cols-3 gap-4 col-span-1">
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
                                 <FormMessage />
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
                                 <FormMessage />
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
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Price Range */}
                     <div className="grid grid-cols-2 gap-4 col-span-1">
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
                     </div>

                     {/* Website */}
                     <FormFieldInput
                        control={form.control}
                        name="placeDetail.url"
                        label="Đường dẫn đến trang địa điểm"
                        placeholder="Nhập URL"
                     />

                     <FormField
                        control={form.control}
                        name="placeDetail.description"
                        render={({ field }) => (
                           <FormItem className=" col-span-3 grid-cols-subgrid">
                              <div className="flex flex-col justify-between focus-within:text-blue2">
                                 <FormLabel>Giới thiệu địa điểm</FormLabel>

                              </div>
                              <FormControl className="w-full h-[100px] border-none bg-white3 focus:bg-white">
                                 <Textarea
                                    placeholder="Nhập nội dung"
                                    {...field}
                                    value={field.value ?? ""}
                                    className="h-min-[100px] bg-white3 focus:bg-white focus:border-blue2 flex-grow-[3]"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  {/* Description Sections */}
                  <SectionInputField
                     sections={sections}
                     setSections={setSections}
                     setSectionImages={setSectionImages}
                     label="Mô tả thêm về địa điểm"
                  />

                  {/* Cover Images */}
                  <div className="w-full px-[40px]">
                     <AddImageField
                        selectedImage={selectedCoverImage}
                        setSelectedImage={setSelectedCoverImage}
                        updateImageUrl={coverImageDeleted ? undefined : form.getValues().coverImage?.imageUrl}
                        label="Ảnh bìa của địa điểm"
                        onExistingImageDelete={() => {
                           setCoverImageDeleted(true);
                           // Clear the image data in the form
                           form.setValue('coverImage.imageUrl', '');
                           form.setValue('coverImage.imagePublicId', '');
                        }}
                     />
                  </div>

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