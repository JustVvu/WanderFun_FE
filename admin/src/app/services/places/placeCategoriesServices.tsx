import { PlaceCategory, PlaceCategoryCreatePayload } from "@/models/places/placeCategory";
import * as utils from "@/app/services/utils";
import client from "@/services/client";
import { toast } from "sonner";

export const getAllPlaceCategories = async (): Promise<PlaceCategory[]> => {
   const token = await utils.getAuthTokenFromServerCookies();
   const response = await client<PlaceCategory[]>('/category',
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

export const getPlaceCategoryById = async (placeCategoryId: string): Promise<PlaceCategory> => {
   const token = await utils.getAuthTokenFromServerCookies();
   const response = await client<PlaceCategory>(`/category/${placeCategoryId}`,
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
   const response = await client<void>('/category',
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

export const updatePlaceCategory = async (placeCategoryId: string, data: PlaceCategoryCreatePayload): Promise<void> => {
   const token = await utils.getAuthTokenFromServerCookies();
   const response = await client<void>(`/category/${placeCategoryId}`,
      {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
         body: JSON.stringify(data),
      }
   );
   console.log(response);
   if (response.error == false) {
      toast.success('Cập nhật phân loại địa điểm thành công');
   }
   else {
      toast.error('Cập nhật phân loại địa điểm thất bại, lỗi: ' + response.message);
      throw new Error('Error adding place');
   }
   return response.data;
}

export const deletePlaceCategory = async (placeCategoryId: string, callback?: () => void): Promise<void> => {
   const token = await utils.getAuthTokenFromServerCookies();
   const response = await client<void>(`/category/${placeCategoryId}`,
      {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
      }
   );
   console.log(response);
   if (response.error == false) {
      toast.success('Xóa phân loại thành công');
      if (callback) {
         callback();
      }
   }
   else {
      toast.error('Xóa phân loại thất bại, lỗi: ' + response.message);
      throw new Error('Error deleting place');
   }
   return response.data;
}

