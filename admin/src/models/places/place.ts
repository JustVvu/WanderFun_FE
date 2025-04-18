import { Address } from "../addresses/address";
import { Image } from "../images/image";
import { PlaceCategory } from "./placeCategory";
import { PlaceDetail } from "./placeDetails";

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
      provinceCode: string;
      districtCode: string;
      wardCode: string;
      street: string;
   };
   categoryId: string;
   longitude: string;
   latitude: string;
   coverImage?: Image;
   placeDetail?: PlaceDetail;
}