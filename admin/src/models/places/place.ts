import { Address } from "../addresses/address";
import { Image } from "../images/image";
import { PlaceCategory } from "./placeCategory";

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
   coverImage: {
      imageUrl: string;
      imagePublicId: string;
   }
}