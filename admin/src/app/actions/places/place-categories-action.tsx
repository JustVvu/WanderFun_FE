import { PlaceCategory, PlaceCategoryCreatePayload } from "@/models/places/placeCategory";
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

export const createPlaceCategory = async (data: PlaceCategoryCreatePayload): Promise<void> => {
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
      toast.success('Thêm phân loại địa điểm thành công');
   }
   else {
      toast.error('Thêm phân loại địa điểm thất bại, lỗi: ' + response.message);
      throw new Error('Error adding place');
   }
   return response.data;
}