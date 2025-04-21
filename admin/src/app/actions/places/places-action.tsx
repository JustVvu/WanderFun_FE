import client from "@/services/client";
import { CreatePlacePayload, Place } from "@/models/places/place";
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
   return response.data
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
   return response.data
}

export const getPlaceByProvinceName = async (provinceName: string): Promise<Place[]> => {
   const token = await utils.getAuthTokenFromServerCookies();
   const response = await client<Place[]>(`/place/search/province/${provinceName}`,
      {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
      }
   );
   return response.data
}

export const addPlace = async (data: CreatePlacePayload, dataPlaceImage: File | null, dataSectionImage: File[]): Promise<void> => {
   const token = await utils.getAuthTokenFromServerCookies();
   //console.log("data: ", data);
   //console.log("dataPlaceImage: ", dataPlaceImage);
   //console.log("dataSectionImage: ", dataSectionImage);
   try {
      if (dataPlaceImage) {
         const uploadResult = await cloudinaryAction.UploadImage(dataPlaceImage, data.name + "/images");
         if (data.coverImage) {
            data.coverImage.imagePublicId = uploadResult?.public_id;
            data.coverImage.imageUrl = uploadResult?.secure_url;
         }

         console.log(data);
      }
      if (dataSectionImage.length > 0) {
         for (let index = 0; index < (data.placeDetail?.sectionList?.length || 0); index++) {
            const uploadResult = await cloudinaryAction.UploadImages(dataSectionImage, data.name + "/sections");
            if (data.placeDetail?.sectionList && data.placeDetail.sectionList[index]) {
               data.placeDetail.sectionList[index] = {
                  ...data.placeDetail.sectionList[index],
                  image: {
                     ...data.placeDetail.sectionList[index].image,
                     imagePublicId: uploadResult[index].public_id,
                     imageUrl: uploadResult[index].secure_url,
                  },
               };
            }
         }
      }
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

export const addListPlace = async (data: CreatePlacePayload[], /*dataPlaceImage: File | null, dataSectionImage: File[]*/): Promise<void> => {
   const token = await utils.getAuthTokenFromServerCookies();
   //console.log("data: ", data);
   //console.log("dataPlaceImage: ", dataPlaceImage);
   //console.log("dataSectionImage: ", dataSectionImage);
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
      // if (dataSectionImage.length > 0) {
      //    for (let index = 0; index < (data.section?.length || 0); index++) {
      //       const uploadResult = await cloudinaryAction.UploadImage(dataSectionImage, data.name + "/sections");
      //       if (data.section && data.section[index]) {
      //          data.section[index] = {
      //             ...data.section[index],
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



export const updatePlace = async (id: string, data: CreatePlacePayload, dataPlaceImage: File | null, dataSectionImage: File[]): Promise<void> => {
   const token = await utils.getAuthTokenFromServerCookies();

   try {
      if (dataPlaceImage) {
         const uploadResult = await cloudinaryAction.UploadImage(dataPlaceImage, data.name + "/images");
         if (data.coverImage) {
            data.coverImage.imagePublicId = uploadResult?.public_id;
            data.coverImage.imageUrl = uploadResult?.secure_url;
         }
      }

      if (dataSectionImage.length > 0) {
         for (let index = 0; index < (data.placeDetail?.sectionList?.length || 0); index++) {
            const uploadResult = await cloudinaryAction.UploadImages(dataSectionImage, data.name + "/sections");
            if (data.placeDetail?.sectionList && data.placeDetail.sectionList[index]) {
               data.placeDetail.sectionList[index] = {
                  ...data.placeDetail.sectionList[index],
                  image: {
                     ...data.placeDetail.sectionList[index].image,
                     imagePublicId: uploadResult[index].public_id,
                     imageUrl: uploadResult[index].secure_url,
                  },
               };
            }
         }
      }

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
      console.error('Error updating place:', error);
      toast.error(`Cập nhật địa điểm thất bại: ${error}`);
   }
}

export const deletePlace = async (id: string, callback: () => void): Promise<void> => {
   const token = await utils.getAuthTokenFromServerCookies();

   try {
      const place = await getPlaceById(id);
      if (place.coverImage) {
         // for (let i = 0; i < place.placeImages.length; i++) {
         //    try {
         //       const response = await client<void>(`/cloudinary?publicId=${place.placeImages[i].imagePublicId}`,
         //          {
         //             method: 'DELETE',
         //             headers: {
         //                'Content-Type': 'application/json',
         //                'Authorization': `Bearer ${token}`,
         //             }
         //          }
         //       );
         //       if (response.error) {
         //          throw new Error();
         //       }
         //    }
         //    catch (error) {
         //       toast.error('Xóa ảnh thất bại, lỗi: ' + error);
         //       throw new Error('Error deleting image');
         //    }
         // }
         // try {
         //    const response = await client<void>(`/cloudinary?publicId=${place.coverImage.imagePublicId}`,
         //       {
         //          method: 'DELETE',
         //          headers: {
         //             'Content-Type': 'application/json',
         //             'Authorization': `Bearer ${token}`,
         //          }
         //       }
         //    );
         //    if (response.error) {
         //       throw new Error();
         //    }
         // }
         // catch (error) {
         //    toast.error('Xóa ảnh thất bại, lỗi: ' + error);
         //    throw new Error('Error deleting image');
         // }
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