import { User } from "@/types/user";
import { getAuthTokenFromServerCookies } from "./utils";
import client from "@/services/client";

export const getAllUsers = async (): Promise<User[]> => {
   const token = await getAuthTokenFromServerCookies();
   try {
      const response = await client<User[]>('/user',
         {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
            }
         }
      );
      console.log("response: ", response);
      if (response.error) {
         throw new Error();
      }
      return response.data;
   } catch (error) {
      console.error('', error);
      return [];
   }
}