const apiKey = process.env.NEXT_PUBLIC_GOONG_API_KEY;

interface Prediction {
   description: string;
   place_id: string;
   // Add other relevant fields if needed
}

interface AutoCompleteResponse {
   predictions: Prediction[];
   // Add other relevant fields if needed
}

export async function fetchDataAutoComplete(query: string): Promise<void> {

   const apiLink = `https://rsapi.goong.io/place/autocomplete?api_key=${apiKey}&input=${encodeURIComponent(query)}`;

   try {
      const response = await fetch(apiLink);
      const data: AutoCompleteResponse = await response.json();

      if (data.predictions) {
         renderArray(data.predictions);
      } else {
         renderArray([]);
      }
   } catch (error) {
      console.error('Error fetching data:', error);
      renderArray([]); // Render an empty array in case of error
   }
}

// Dummy renderArray function for demonstration purposes
function renderArray(predictions: Prediction[]): void {
   console.log('Predictions:', predictions);
}