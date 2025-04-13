import { MapPlaceDetail, Prediction } from "@/types/map";

const apiKey = process.env.NEXT_PUBLIC_GOONG_API_KEY;
const goongApiUrl = process.env.NEXT_PUBLIC_GOONG_API_URL;

interface AutoCompleteResponse {
   predictions: Prediction[];
}

interface MapPlaceDetailResponse {
   result: MapPlaceDetail;
}

interface GeocodeResponse {
   results: MapPlaceDetail[];
}

export async function fetchDataAutoComplete(
   query: string,
   renderArray: (predictions: Prediction[]) => void
): Promise<void> {
   const apiLink =
      goongApiUrl + `/place/autocomplete?api_key=${apiKey}&input=${encodeURIComponent(query)}&limit=10&more_compound=true`;

   try {
      const response = await fetch(apiLink);
      const data: AutoCompleteResponse = await response.json();

      if (data.predictions) {
         renderArray(data.predictions);
      } else {
         renderArray([]);
      }
   } catch (error) {
      console.error("Error fetching data:", error);
      renderArray([]); // Render an empty array in case of error
   }
}

export async function fetchDataPlaceDetail(
   placeId: string,
   renderObject: (mapPlaceDetail: MapPlaceDetail) => void
): Promise<void> {
   const apiLink = goongApiUrl + `/place/detail?api_key=${apiKey}&place_id=${placeId}`;

   try {
      const response = await fetch(apiLink);
      const data: MapPlaceDetailResponse = await response.json();

      renderObject(data.result);
   } catch (error) {
      console.error("Error fetching data:", error);
   }
}

export async function fetchDataPlaceDetailByCoordinates(
   lat: string,
   lng: string,
   renderArray: (reverseGeocodeResults: MapPlaceDetail[]) => void
): Promise<void> {
   const apiLink = goongApiUrl + `/geocode?api_key=${apiKey}&latlng=${lat},${lng}`;
   try {
      const response = await fetch(apiLink);
      const data: GeocodeResponse = await response.json();
      //console.log("Data from fetchDataPlaceDetailByCoordinates:", data);
      if (data.results) {
         renderArray(data.results);
      } else {
         renderArray([]);
      }
   } catch (error) {
      console.error("Error fetching data:", error);
      renderArray([]);
   }
}
