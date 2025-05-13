import { Address } from "../addresses/address";
import { Image, ImageDTO } from "../images/image";
import { PlaceCategory } from "./placeCategory";
import { PlaceDetail, PlaceDetailDTO } from "./placeDetails";

export interface Place {
   id: number;
   name: string;
   address: Address;
   category: PlaceCategory;
   longitude: string;
   latitude: string;
   rating: string;
   totalRating: string;
   totalFeedback: string;
   coverImage: Image;
   placeDetail: PlaceDetail;
}

export interface CreatePlacePayload {
   name: string;
   address: {
      provinceName: string;
      districtName: string;
      wardName?: string;
      street?: string;
   };
   categoryId: string;
   longitude: string;
   latitude: string;
   coverImage?: ImageDTO;
   placeDetail?: PlaceDetailDTO;
}