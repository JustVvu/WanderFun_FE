import { PlaceCategory } from "./placeCategory";

export interface PlaceDescription {
   title: string;
   content: string;
   imageUrl: string;
   imagePublicId: string;
}
export interface NewImage {
   imageUrl: string;
   imagePublicId: string;
 }
export interface Place {
   id: number;
   name: string;
   alternativeName: string;
   address: string;
   category: PlaceCategory;
   operator: string;
   timeOpen: Date;
   timeClose: Date;
   openAllDay: boolean;
   closing: boolean;
   longitude: string;
   latitude: string;
   checkInPoint: string;
   checkInRange: string;
   description: PlaceDescription[];
   link: string;
   iconUrl: string;
   coverImageUrl: string;
   coverPublidId: string;
   placeImages: NewImage[];
}

export interface AddPlacePayload {
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