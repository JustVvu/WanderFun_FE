export interface Prediction {
   description: string;
   place_id: string;
}

export interface MapPlaceDetail {
   place_id: string;
   name: string;
   formatted_address: string;
   compound: {
      commune: string;
      district: string;
      province: string;
   };
   geometry: {
      location: {
         lat: number;
         lng: number;
      };
   };
}
