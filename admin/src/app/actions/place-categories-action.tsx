import { PlaceCategory, PlaceCategoryPayload } from "@/types/placeCategory";
import * as utils from "@/app/actions/utils";
import client from "@/services/client";
import { toast } from "sonner";

export const getAllPlaceCategories = async (): Promise<PlaceCategory[]> => {
   const token = await utils.getAuthTokenFromServerCookies();
   const response = await client<PlaceCategory[]>('/place/categories',
      {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
      }
   );
   return response.data;
}

export const createPlaceCategory = async (data: PlaceCategoryPayload): Promise<void> => {
   const token = await utils.getAuthTokenFromServerCookies();
   const response = await client<void>('/place/categories',
      {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
         body: JSON.stringify(data),
      }
   );
   console.log(response);
   if (response.error == false) {
      toast.success('Thêm địa điểm thành công');
   }
   else {
      toast.error('Thêm địa điểm thất bại, lỗi: ' + response.message);
      throw new Error('Error adding place');
   }
   return response.data;
}