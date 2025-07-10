import { Section, SectionDTO } from "./section";

export interface PlaceDetail {
   id: number;
   placeId: number;
   description: string;
   timeOpen: string;
   timeClose: string;
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

export interface PlaceDetailDTO {
   id?: number;
   description?: string;
   timeOpen?: string;
   timeClose?: string;
   isClosed?: boolean;
   bestTimeToVisit?: string;
   priceRangeTop?: number;
   priceRangeBottom?: number;
   isVerified?: boolean;
   alternativeName?: string;
   operator?: string;
   url?: string;
   sectionList?: SectionDTO[];
}
