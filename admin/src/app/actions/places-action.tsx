import { mapCategoryToEnum } from "@/helper/mapper";
import client from "@/services/client";
import { AddPlacePayload, Place } from "@/types/place";
import * as utils from "@/app/actions/utils";

export const getAllPlaces = async (): Promise<Place[]> => {
   const token = await utils.getAuthTokenFromServerCookies();
   const response = await client<Place[]>('/place',
      {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
      }
   );
   const transformedResponse = response.data.map((place) => ({
      ...place,
      category: mapCategoryToEnum(place.category as unknown as string),
   }));

   return transformedResponse;
}

export const getPlaceById = async (id: string): Promise<Place> => {
   const token = await utils.getAuthTokenFromServerCookies();
   const response = await client<Place>(`/place/${id}`,
      {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
      }
   );
   return {
      ...response.data,
      category: mapCategoryToEnum(response.data.category as unknown as string),
   };
}

export const addPlace = async (data: AddPlacePayload): Promise<void> => {
   const token = await utils.getAuthTokenFromServerCookies();
   //console.log(token);
   //console.log(data);
   try {
      const response = await client<void>('/place',
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
         }
      );
      console.log(response.data);
      return response.data;
   }
   catch (error) {
      throw new Error(`Error adding place: ${error}`);
   }
}