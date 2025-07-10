"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronLeft, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { getPlaceById } from '@/app/services/places/placesServices';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Place } from '@/models/places/place';
import Image from 'next/image';
import { useLoading } from '@/contexts/LoadingContext';

export default function PlaceDetailPage() {
   const searchParams = useSearchParams();
   const placeId = searchParams.get('id');
   const router = useRouter();
   const { setLoadingState } = useLoading();

   const [place, setPlace] = useState<Place | null>(null);

   useEffect(() => {
      const fetchPlace = async () => {
         try {
            setLoadingState(true);
            if (!placeId) return;
            const data = await getPlaceById(placeId);
            setPlace(data);
         } catch (error) {
            toast.error(`Không thể tải thông tin địa điểm (${error})`);
         }
         finally {
            setLoadingState(false);
         }
      };

      fetchPlace();
   }, [placeId]);

   return (
      <div className="m-6 p-6 rounded-2xl bg-white">
         <div className="flex items-center space-x-4 mb-6 justify-between">
            <Button
               variant="outline"
               size="icon"
               onClick={() => router.back()}
               className="border-2 rounded-full"
            >
               <ChevronLeft />
            </Button>
            <h1 className="text-2xl font-semibold text-blue3 place-self-center">{place?.name}</h1>
            <Button
               onClick={() => router.push(`/places/add?id=${place?.id}`)}
               className="w-fit h-fit bg-blue2 text-white1 border rounded-[8px] hover:bg-blue3"
            >
               <Edit /> Chỉnh sửa địa điểm
            </Button>
         </div>

         <div className="grid grid-cols-3 gap-6 px-4 py-4">
            <div className="col-span-3 w-full h-[450px] relative">
               <Image
                  src={place?.coverImage.imageUrl || '/placeholder-image.png'}
                  alt={"cover"}
                  className="object-cover rounded-lg"
                  fill
                  sizes="(max-width: 600px) 100vw, 50vw"
               />
            </div>
            <p className='col-span-2 text-lg px-5'>
               <strong>Địa chỉ: </strong>
               {place?.address?.street || ''}  {place?.address?.ward?.name + ", " || ''}
               {place?.address?.district?.name + ", " || ''} {place?.address?.province?.name || ''}
            </p>
            <div className='grid grid-cols-2 gap-y-3 col-span-2 text-lg px-5'>
               <p>
                  <strong>Tên gọi khác:</strong> {place?.placeDetail?.alternativeName || 'Chưa có thông tin'}
               </p>
               <p>
                  <strong>Loại:</strong> {place?.category?.name}
               </p>
               <p>
                  <strong>Giờ mở cửa:</strong> {place?.placeDetail?.timeOpen}
               </p>
               <p>
                  <strong>Giờ đóng cửa:</strong> {place?.placeDetail?.timeClose}
               </p>
               <p>
                  <strong>Khoảng cách check-in:</strong> {place?.placeDetail?.checkInRangeMeter} m
               </p>
               <p>
                  <strong>Điểm check-in:</strong> {place?.placeDetail?.checkInPoint}
               </p>
               <p>
                  <strong>Giá thấp nhất:</strong> {place?.placeDetail?.priceRangeBottom} VND
               </p>
               <p>
                  <strong>Giá cao nhất:</strong> {place?.placeDetail?.priceRangeTop} VND
               </p>
               <p>
                  <strong>Kinh độ:</strong> {place?.longitude}
               </p>
               <p>
                  <strong>Vĩ độ:</strong> {place?.latitude}
               </p>
               <p>
                  <strong>Đại diện quản lý:</strong> {place?.placeDetail?.operator || 'Chưa có thông tin'}
               </p>
               <p>
                  <strong>Liên kết:</strong> {place?.placeDetail?.url ? (
                     <a href={place?.placeDetail.url} target="_blank" className="text-blue-600 underline">
                        {place?.placeDetail.url}
                     </a>
                  ) : 'Chưa có thông tin'}
               </p>
               <p>
                  <strong>Tình trạng: </strong>
                  {place?.placeDetail?.isClosed ? (
                     <span className="text-red3">Ngừng hoạt động</span>
                  ) : (
                     <span className="text-green4">Đang hoạt động</span>
                  )}
               </p>
            </div>
         </div>

         <Separator className="my-6 mx-5 " />

         <div className="px-4">
            <div className="px-5 text-lg">
               <h2 className="text-xl font-bold mb-4">Giới thiệu địa điểm</h2>
               <p>{place?.placeDetail?.description || 'Không có mô tả.'}</p>
            </div>

            {(place?.placeDetail?.sectionList?.length ?? 0) > 0 && (
               <div className="mt-6 space-y-3 px-5">
                  <h2 className="text-xl font-bold">Mô tả chi tiết</h2>
                  {place?.placeDetail?.sectionList?.map((section, idx) => (
                     <div key={idx} className='flex flex-row justify-between'>
                        <div className="rounded-xl p-4 bg-white2">
                           <h3 className="text-lg font-semibold">{section.title}</h3>
                           <p className="">{section.content}</p>
                        </div>
                        <div className="w-1/4 h-full flex-shrink-0 justify-items-end">
                           <Image
                              src={section.image?.imageUrl || '/placeholder-image.png'}
                              alt={section.title}
                              className="rounded-lg"
                              width={200}
                              height={150}
                              sizes="(max-width: 600px) 100vw, 50vw"
                           />
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
