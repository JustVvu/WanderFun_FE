export enum Category {
   MUSEUM = "Bảo tàng",
   HOTEL = "Khách sạn",
   ENTERTAINMENT = "Giải trí",
   PARK = "Công viên",
   RESTAURANT = "Nhà hàng",
   SHOPPING = "Mua sắm",
   OTHER = "Khác",
 }

export interface PlaceDescription {
   title: string;
   content: string;
   imageUrl: string;
}
export interface Place {
   id: number;
   name: string;
   alternativeName: string;
   address: string;
   category: Category;
   operator: string;
   openTime: Date;
   closeTime: Date;
   longitude: string;
   latitude: string;
   checkInPoint: string;
   checkInRange: string;
   description: PlaceDescription[];
   link: string;
   iconUrl: string;
   coverImageUrl: string;
   placeImages: File[];
}

export interface AddPlacePayload {
   name: string;
   alternativeName?: string;
   address: string;
   category: Category;
   operator?: string;
   openTime?: Date;
   closeTime?: Date;
   longitude: string;
   latitude: string;
   checkInPoint: string;
   checkInRange: string;
   description?: PlaceDescription[];
   link?: string;
   iconUrl?: string;
   coverImageUrl?: string;
   placeImages?: File[];
}