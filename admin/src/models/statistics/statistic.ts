export interface Statistic {
   totalUsers: number;
   totalPlaces: number;
   totalCreatedAccountsToday: number;
   totalCheckInAllTime: number;
   totalCheckInToday: number;
   accountsList: [
      {
         verified: boolean;
         createAt: string;
      }
   ]
   topCheckInPlaces: [
      {
         placeId: number;
         name: string;
         checkInCount: number;
         ranking: number;
      }
   ];
   topCheckInUsers: [
      {
         userId: number;
         firstName: string;
         lastName: string;
         avatarUrl: string;
         point: number;
         checkInCount: number;
         ranking: number;
      }
   ];
}