import { Section } from "./section";

export interface PlaceDetail {
   id?: number;
   placeId?: number;
   description: string;
   checkInPoint: number;
   checkInRangeMeter: number;
   timeOpen: Date;
   timeClose: Date;
   isClosed: boolean;
   bestTimeToVisit: string;
   priceRangeTop: number;
   priceRangeBottom: number;
   isVerified: boolean;
   alternativeName: string;
   operator: string;
   url: string;
   sectionList: Section[];
}
