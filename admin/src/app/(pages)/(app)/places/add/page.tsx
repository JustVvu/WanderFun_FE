// app/places/add/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getAllPlaceCategories } from '@/app/services/places/placeCategoriesServices';
import { PlaceCategory } from '@/models/places/placeCategory';

import PlaceForm from './components/PlaceForm';

export default function AddPlace() {
   const searchParams = useSearchParams();
   const [categoryList, setCategoryList] = useState<PlaceCategory[]>([]);

   const placeId = searchParams.get('id');
   const lat = searchParams.get('lat');
   const lng = searchParams.get('lng');

   // Load categories on page load
   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const fetchedCategories = await getAllPlaceCategories();
            setCategoryList(fetchedCategories);
         } catch (error) {
            toast.error(`Không thể tải danh sách phân loại địa điểm (${error})`);
         }
      };

      fetchCategories();
   }, []);

   // Refresh category list after new category is created
   const handleCategoryChange = async () => {
      try {
         const fetchedCategories = await getAllPlaceCategories();
         setCategoryList(fetchedCategories);
      } catch (error) {
         toast.error(`Không thể tải lại danh sách phân loại địa điểm (${error})`);
      }
   };

   return (
      <PlaceForm
         isUpdate={!!placeId}
         placeId={placeId || undefined}
         lat={lat || undefined}
         lng={lng || undefined}
         categoryList={categoryList}
         onCategoryChange={handleCategoryChange}
      />
   );
}