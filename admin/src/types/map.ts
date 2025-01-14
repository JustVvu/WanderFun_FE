export interface Prediction {
   description: string;
   place_id: string;
}

export interface MapPlaceDetail {
   place_id: string;
   name: string;
   formatted_address: string;
   address: string;
   geometry: {
      location: {
         lat: number;
         lng: number;
      };
   };
}
