import { mapCategoryToEnum } from "@/helper/mapper";
import client from "@/services/client";
import { Place } from "@/types/place";


export const getAllPlaces = async (): Promise<Place[]> => {
   const response = await client<Place[]>('/place',
      {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
         },
      }
   );
   const transformedResponse = response.map((place) => ({
      ...place,
      category: mapCategoryToEnum(place.category as unknown as string),
   }));

   return transformedResponse;
}

export const getPlaceById = async (id: number): Promise<Place> => {
   const response = await client<Place>(`/place/${id}`,
      {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
         },
      }
   );
   return {
      ...response,
      category: mapCategoryToEnum(response.category as unknown as string),
   };
}