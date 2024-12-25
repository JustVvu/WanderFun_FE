export enum Category {
   MUSEUM = "Bảo tàng",
   HOTEL = "Khách sạn",
   ENTERTAINMENT = "Giải trí",
   PARK = "Công viên",
   RESTAURANT = "Nhà hàng",
   SHOPPING = "Mua sắm",
   OTHER = "Khác",
 }

export interface PlaceImage {
   id: number;
   imageUrl: string;
   placeId: number;
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
   longitude: number;
   latitude: number;
   checkInPoint: number;
   checkInRange: number;
   link: string;
   placeImages: PlaceImage[];
}