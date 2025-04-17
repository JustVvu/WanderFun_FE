export interface PlaceCategory {
   id: number;
   name: string;
   nameEn: string;
   iconImage: string
}

export interface PlaceCategoryPayload {
   name: string;
   nameEn: string;
   iconImage?: string
}