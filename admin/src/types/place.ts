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
   category: Category;
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
   alternativeName?: string;
   address: string;
   category: Category;
   operator?: string;
   timeOpen?: string;
   timeClose?: string;
   longitude: string;
   latitude: string;
   checkInPoint: string;
   checkInRange: string;
   description: PlaceDescription[];
   link?: string;
   iconUrl?: string;
   coverImageUrl?: string;
   coverImagePublicId?: string;
   placeImages?: NewImage[];
}