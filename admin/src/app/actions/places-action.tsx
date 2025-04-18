import client from "@/services/client";
import { CreatePlacePayload, Place } from "@/models/place";
import * as utils from "@/app/actions/utils";
import * as cloudinaryAction from "@/app/actions/cloudinary-action";
import { toast } from "sonner";

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
   return {
      ...response.data
   };
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
      ...response.data
   };
}

export const addPlace = async (data: CreatePlacePayload, /* dataPlaceImage: File[], dataDescriptionImage: File[] */): Promise<void> => {
   const token = await utils.getAuthTokenFromServerCookies();
   //console.log("data: ", data);
   //console.log("dataPlaceImage: ", dataPlaceImage);
   //console.log("dataDescriptionImage: ", dataDescriptionImage);
   try {
      // if (dataPlaceImage.length > 0) {
      //    const uploadResult = await cloudinaryAction.UploadImage(dataPlaceImage, data.name + "/images");
      //    data.placeImages = uploadResult.map((result) => ({
      //       imageUrl: result.secure_url,
      //       imagePublicId: result.public_id
      //    }));
      //    data.coverImageUrl = data.placeImages[0].imageUrl;
      //    data.coverImagePublicId = data.placeImages[0].imagePublicId;
      //    console.log(data);
      // }
      // if (dataDescriptionImage.length > 0) {
      //    for (let index = 0; index < (data.description?.length || 0); index++) {
      //       const uploadResult = await cloudinaryAction.UploadImage(dataDescriptionImage, data.name + "/descriptions");
      //       if (data.description && data.description[index]) {
      //          data.description[index] = {
      //             ...data.description[index],
      //             imageUrl: uploadResult[0].secure_url,
      //             imagePublicId: uploadResult[0].public_id
      //          };
      //       }
      //    }
      // }
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
   catch (error) {
      console.error('', error);
   }
}

export const addListPlace = async (data: CreatePlacePayload[], /* dataPlaceImage: File[], dataDescriptionImage: File[] */): Promise<void> => {
   const token = await utils.getAuthTokenFromServerCookies();
   //console.log("data: ", data);
   //console.log("dataPlaceImage: ", dataPlaceImage);
   //console.log("dataDescriptionImage: ", dataDescriptionImage);
   try {
      // if (dataPlaceImage.length > 0) {
      //    const uploadResult = await cloudinaryAction.UploadImage(dataPlaceImage, data.name + "/images");
      //    data.placeImages = uploadResult.map((result) => ({
      //       imageUrl: result.secure_url,
      //       imagePublicId: result.public_id
      //    }));
      //    data.coverImageUrl = data.placeImages[0].imageUrl;
      //    data.coverImagePublicId = data.placeImages[0].imagePublicId;
      //    console.log(data);
      // }
      // if (dataDescriptionImage.length > 0) {
      //    for (let index = 0; index < (data.description?.length || 0); index++) {
      //       const uploadResult = await cloudinaryAction.UploadImage(dataDescriptionImage, data.name + "/descriptions");
      //       if (data.description && data.description[index]) {
      //          data.description[index] = {
      //             ...data.description[index],
      //             imageUrl: uploadResult[0].secure_url,
      //             imagePublicId: uploadResult[0].public_id
      //          };
      //       }
      //    }
      // }
      const response = await client<void>('/place/all',
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
   catch (error) {
      console.error('', error);
   }
}



export const updatePlace = async (id: string, data: CreatePlacePayload, /* dataPlaceImage: File[], dataDescriptionImage: File[] */): Promise<void> => {
   const token = await utils.getAuthTokenFromServerCookies();

   try {
      // if (dataPlaceImage.length > 0) {

      //    const uploadResult = await cloudinaryAction.UploadImage(dataPlaceImage, data.name);
      //    data.placeImages = uploadResult.map((result) => ({
      //       imageUrl: result.secure_url,
      //       imagePublicId: result.public_id
      //    }));
      // }
      // if (dataDescriptionImage.length > 0) {
      //    for (let index = 0; index < (data.description?.length || 0); index++) {
      //       const uploadResult = await cloudinaryAction.UploadImage(dataDescriptionImage, data.name + "/description");
      //       if (data.description && data.description[index]) {
      //          data.description[index] = {
      //             ...data.description[index],
      //             imageUrl: uploadResult[0].secure_url,
      //             imagePublicId: uploadResult[0].public_id
      //          };
      //       };
      //    }
      // }
      console.log("Data before API calling: ", data);
      const response = await client<void>(`/place/${id}`,
         {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
         }
      );
      if (response.error == false) {
         toast.success('Cập nhật địa điểm thành công');
      }
      else {
         toast.error('Cập nhật địa điểm thất bại, lỗi: ' + response.message);
         throw new Error('Error updating place');
      }
      return response.data;
   }
   catch (error) {
      console.error('', error);
   }
}

export const deletePlace = async (id: string, callback: () => void): Promise<void> => {
   const token = await utils.getAuthTokenFromServerCookies();

   try {
      const place = await getPlaceById(id);
      if (place.placeImages) {
         for (let i = 0; i < place.placeImages.length; i++) {
            try {
               const response = await client<void>(`/cloudinary?publicId=${place.placeImages[i].imagePublicId}`,
                  {
                     method: 'DELETE',
                     headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                     }
                  }
               );
               if (response.error) {
                  throw new Error();
               }
            }
            catch (error) {
               toast.error('Xóa ảnh thất bại, lỗi: ' + error);
               throw new Error('Error deleting image');
            }
         }
      }
      const response = await client<void>(`/place/${id}`,
         {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
            },
         }
      );
      if (response.error == false) {
         toast.success('Xóa địa điểm thành công');
         callback();
      }
      else {
         toast.error('Xóa địa điểm thất bại, lỗi: ' + response.message);
         throw new Error('Error deleting place');
      }
      return response.data;
   }
   catch (error) {
      console.error('', error);
   }
}