import { Statistic } from "@/models/statistics/statistic";
import { getAuthTokenFromServerCookies } from "../utils";
import client from "@/services/client";

export const getStatistics = async (): Promise<Statistic> => {
   const token = await getAuthTokenFromServerCookies();
   try {
      const response = await client<Statistic>('/statistics/all',
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
      return {} as Statistic;
   }
}