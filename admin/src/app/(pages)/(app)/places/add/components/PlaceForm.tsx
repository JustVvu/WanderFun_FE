// app/places/components/PlaceForm.tsx
"use client";

import { ChevronLeft, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormFieldInput } from '@/app/components/FormFieldInput';
import {
   getDistrictByNameAndProvinceCode, getProvinceByName, getWardByNameAndDistrictCode
} from '@/app/services/addresses/addressServices';
import { fetchDataPlaceDetailByCoordinates } from '@/app/services/mapServices';
import * as placeAction from '@/app/services/places/placesServices';
import { Button } from '@/components/ui/button';
import {
   Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useLoading } from '@/contexts/LoadingContext';
import { parseTimeString } from '@/helpers/convertHelper';
import { PlaceCategory } from '@/models/places/placeCategory';
import { SectionDTO } from '@/models/places/section';
import { zodResolver } from '@hookform/resolvers/zod';

import AddImageField from './AddImageField';
import { CategoryComboBox } from './CategoryComboBox';
import CreateCategoryModal from './CreateCategoryModal';
import {
   defaultFormValues, mapFormValuesToApiPayload, placeFormSchema, PlaceFormValues
} from './PlaceFormSchema';
import ProvinceDistrictSelector from './ProvinceDistrictSelector';
import SectionInputField from './SectionInputField';
import { TimePicker } from './TimePicker/TimePicker';

interface PlaceFormProps {
   isUpdate?: boolean;
   placeId?: string;
   lat?: string;
   lng?: string;
   categoryList: PlaceCategory[];
   onCategoryChange?: () => Promise<void>;
}

export default function PlaceForm({
   isUpdate = false,
   placeId,
   lat,
   lng,
   categoryList,
   onCategoryChange
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
   const { isDirty } = form.formState;

   // Load place data for update
   useEffect(() => {
      if (!isUpdate || !placeId) return;
      const fetchPlaceData = async () => {
         try {
            setLoadingState(true);
            const fetchedData = await placeAction.getPlaceById(placeId);
            console.log("Fetched place data: ", fetchedData);
            reset({
               name: fetchedData.name,
               longitude: fetchedData.longitude.toString(),
               latitude: fetchedData.latitude.toString(),
               address: {
                  provinceName: fetchedData.address.province?.name,
                  districtName: fetchedData.address.district?.name,
                  wardName: fetchedData.address.ward?.name,
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
                  form.setValue('address.provinceName', province.fullName);

                  const district = await getDistrictByNameAndProvinceCode(result[0]?.compound?.district, province.fullName);
                  form.setValue('address.districtName', district.fullName);

                  const ward = await getWardByNameAndDistrictCode(result[0]?.compound?.commune, district.fullName);
                  form.setValue('address.wardName', ward.fullName);
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
            //toast.success('Cập nhật địa điểm thành công');
         } else {
            await placeAction.addPlace(payload, selectedCoverImage, sectionImages);
            //toast.success('Thêm địa điểm thành công');
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
      if (onCategoryChange) {
         await onCategoryChange();
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
                  className="flex flex-col w-full h-fit px-[20px] space-y-[24px]"
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
                           provinceNameField="address.provinceName"
                           districtNameField="address.districtName"
                           wardNameField="address.wardName"
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
                           <CategoryComboBox
                              control={form.control}
                              name="categoryId"
                              label="Phân loại địa điểm"
                              options={categoryList.map((category) => ({
                                 label: category.name,
                                 value: category.id.toString(),
                              }))}
                              placeholder="Loại địa điểm"
                              onCategoryChange={onCategoryChange}
                           />
                        </div>
                        <Button
                           onClick={() => setModalOpen(true)}
                           type="button"
                           variant="outline"
                           size="icon"
                           className="h-[40px] w-[40px] flex-2 self-center shadow-none text-blue1 border-none hover:bg-white hover:text-blue3 hover:border-none"
                        >
                           <PlusCircle className='scale-150' />
                        </Button>
                        <CreateCategoryModal
                           isOpen={isModalOpen}
                           onChange={setModalOpen}
                           onSuccess={handleCategoryCreate}
                        />
                     </div>

                     <div className='col-span-3 grid grid-cols-4 gap-x-4 gap-y-[24px]'>
                        {/* Check-in settings */}
                        <div className='col-span-2 grid grid-cols-2 gap-x-4 gap-y-[24px]'>
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

                        {/* Price Range */}
                        <div className="grid grid-cols-2 gap-4 col-span-2">
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

                        {/* Opening Hours */}
                        <div className='col-span-3 grid grid-cols-3'>
                           <FormField
                              control={form.control}
                              name="placeDetail.timeOpen"
                              render={({ field, fieldState: { error } }) => (
                                 <FormItem className="flex flex-col">
                                    <FormLabel className="text-left">Giờ mở cửa (Giờ/Phút)</FormLabel>
                                    <FormControl>
                                       <TimePicker
                                          setDate={field.onChange}
                                          date={field.value}
                                       />
                                    </FormControl>
                                    <FormMessage
                                       className={`${error ? "text-red-500" : "invisible"}`}
                                    >
                                       {error?.message}
                                    </FormMessage>
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name="placeDetail.timeClose"
                              render={({ field, fieldState: { error } }) => (
                                 <FormItem className="flex flex-col">
                                    <FormLabel className="text-left">Giờ đóng cửa (Giờ/Phút)</FormLabel>
                                    <FormControl>
                                       <TimePicker
                                          setDate={field.onChange}
                                          date={field.value}
                                       />
                                    </FormControl>
                                    <FormMessage
                                       className={`${error ? "text-red-500" : "invisible"}`}
                                    >
                                       {error?.message}
                                    </FormMessage>
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name="placeDetail.isClosed"
                              render={({ field, fieldState: { error } }) => (
                                 <FormItem className="flex flex-col">
                                    <FormLabel className="text-left">Đang đóng cửa</FormLabel>
                                    <FormControl>
                                       <Switch
                                          className="self-baseline data-[state=checked]:bg-blue2 data-[state=unchecked]:bg-white4"
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                       />
                                    </FormControl>
                                    <FormMessage
                                       className={`${error ? "text-red-500" : "invisible"}`}
                                    >
                                       {error?.message}
                                    </FormMessage>
                                 </FormItem>
                              )}
                           />
                        </div>

                        {/* Website */}
                        <div className='col-span-2'>
                           <FormFieldInput
                              control={form.control}
                              name="placeDetail.url"
                              label="Đường dẫn đến trang địa điểm"
                              placeholder="Nhập URL"
                           />
                        </div>
                     </div>

                     <FormField
                        control={form.control}
                        name="placeDetail.description"
                        render={({ field, fieldState: { error } }) => (
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
                              <FormMessage
                                 className={`${error ? "text-red-500" : "invisible"}`}
                              >
                                 {error?.message}
                              </FormMessage>
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
                     disabled={!isDirty || form.formState.isSubmitting}
                  >
                     Lưu thông tin
                  </Button>
               </form>
            </Form>
         </div>
      </div>
   );
}