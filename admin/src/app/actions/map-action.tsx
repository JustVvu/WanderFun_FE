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

export async function fetchDataPlaceDetail(placeId: string): Promise<MapPlaceDetail> {
   const apiLink = goongApiUrl + `/place/detail?api_key=${apiKey}&place_id=${placeId}`;

   try {
      const response = await fetch(apiLink);
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MapPlaceDetailResponse = await response.json();
      return data.result;
   } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
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

// A helper delay function that returns a promise that resolves after the specified milliseconds.
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Cache for autocomplete results to avoid duplicate API calls
const autoCompleteCache = new Map<string, Prediction | null>();

export async function fetchLatLngFromCSV(
   queries: string[]
): Promise<MapPlaceDetail[]> {
   const DELAY_MS = 200; // Increase delay (e.g., 1 second) to reduce rate limit issues
   const placeDetailResults: MapPlaceDetail[] = [];

   // Helper function to fetch a single autocomplete result with caching
   const fetchSingle = async (query: string): Promise<Prediction | null> => {
      if (autoCompleteCache.has(query)) {
         return autoCompleteCache.get(query)!;
      }

      const url =
         goongApiUrl +
         `/place/autocomplete?api_key=${apiKey}&input=${encodeURIComponent(
            query
         )}&limit=10&more_compound=true`;

      const response = await fetch(url);
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: AutoCompleteResponse = await response.json();
      const prediction: Prediction | null = data.predictions?.[0] || null;
      autoCompleteCache.set(query, prediction);
      return prediction;
   };

   // Process each query sequentially
   for (const query of queries) {
      try {
         // Fetch autocomplete result for the current query
         const autoCompleteResult = await fetchSingle(query);
         // Wait a bit before making the next request
         await delay(DELAY_MS);
         if (autoCompleteResult) {
            try {
               // Fetch place detail using the placeId from the autocomplete result
               const placeDetailResult = await fetchDataPlaceDetail(autoCompleteResult.place_id);
               placeDetailResults.push(placeDetailResult);
            } catch (error) {
               console.error(`Error fetching place detail for ${autoCompleteResult.place_id}:`, error);
            }
         }
      } catch (error) {
         console.error(`Error fetching autocomplete for ${query}:`, error);
      }
      // Wait before processing the next query
      await delay(DELAY_MS);
   }

   return placeDetailResults;
}