import { User } from "@/models/users/user";
import { getAuthTokenFromServerCookies } from "./utils";
import client from "@/services/client";
import { Account } from "@/models/users/account";

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

export const getAllUserAccounts = async (): Promise<Account[]> => {
   const token = await getAuthTokenFromServerCookies();
   try {
      const response = await client<Account[]>('/account',
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

export const changeAccountStatus = async (accountId: number): Promise<void> => {
   const token = await getAuthTokenFromServerCookies();
   try {
      const response = await client(`/account/active/${accountId}`,
         {
            method: 'PUT',
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
   } catch (error) {
      console.error('Error changing account status:', error);
      throw error;
   }
}