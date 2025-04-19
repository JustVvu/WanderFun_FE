import { Image } from "../images/image";

export interface PlaceCategory {
   id: number;
   name: string;
   nameEn: string;
   iconImage: Image;
}

export interface PlaceCategoryCreatePayload {
   name: string;
   nameEn: string;
   iconImage?: string
}