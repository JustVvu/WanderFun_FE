import client from "@/services/client";
import { getAuthTokenFromServerCookies } from "../utils";
import { Province } from "@/models/addresses/province";
import { District } from "@/models/addresses/district";


export const getAllProvinces = async (): Promise<Province[]> => {
   const token = await getAuthTokenFromServerCookies();
   const response = await client<Province[]>('/address/province',
      {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
      }
   );
   console.log('Provinces response:', response.data);

   return response.data
}

export const getProvinceByName = async (name: string): Promise<Province> => {
   const token = await getAuthTokenFromServerCookies();
   const response = await client<Province>(`/address/province/${name}`,
      {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
      }
   );
   console.log('Province response:', response.data);

   return response.data
}

export const getDistrictsByProvinceCode = async (provinceCode: string): Promise<District[]> => {
   const token = await getAuthTokenFromServerCookies();
   const response = await client<District[]>(`address/district/${provinceCode}`,
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

export const getDistrictByNameAndProvinceCode = async (name: string, provinceCode: string): Promise<District> => {
   const token = await getAuthTokenFromServerCookies();
   const response = await client<District>(`address/district/${name}/${provinceCode}`,
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