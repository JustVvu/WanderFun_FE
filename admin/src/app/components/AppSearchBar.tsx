import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import * as mapAction from "../services/mapServices";
import { MapPlaceDetail, Prediction } from "@/models/map";

interface AppSearchBarProps {
   onPlaceDetailFetched: (mapPlaceDetail: MapPlaceDetail) => void;
}

export default function AppSearchBar({ onPlaceDetailFetched }: AppSearchBarProps) {
   const [query, setQuery] = useState("");
   const [predictions, setPredictions] = useState<Prediction[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   // Fetch predictions
   const fetchPredictions = async (input: string) => {
      if (!input) {
         setPredictions([]);
         return;
      }

      setLoading(true);
      setError(null);

      try {
         await mapAction.fetchDataAutoComplete(input, (result) => {
            setPredictions(result || []);
         });
      } catch {
         setError("Failed to fetch predictions");
         setPredictions([]);
      } finally {
         setLoading(false);
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setQuery(input);
      if (debounceTimeoutRef.current) {
         clearTimeout(debounceTimeoutRef.current);
      }

      // Set a new debounce timeout
      debounceTimeoutRef.current = setTimeout(() => {
         fetchPredictions(input);
      }, 500);
   };

   const handlePredictionClick = (prediction: Prediction) => {
      //console.log("Selected:", prediction);
      setQuery(prediction.description);
      setPredictions([]);
      mapAction.fetchDataPlaceDetail(prediction.place_id).then((result) => {
         onPlaceDetailFetched(result);
      }).catch((error) => {
         console.error("Error fetching place details:", error);
      });
   };

   return (
      <div className="relative w-full">
         <div
            className="flex items-center w-full space-x-2 rounded-full 
          bg-white1 focus-within:border-blue1 border-[2px] px-3.5 py-2"
         >
            <Search className="h-4 w-4" />
            <Input
               type="search"
               placeholder="Tìm kiếm một địa điểm"
               value={query}
               onChange={handleInputChange}
               className="w-full border-none bg-white1 shadow-none focus-visible:ring-0 h-8"
            />
         </div>

         {/* Display Predictions */}
         {loading && <p className="absolute left-0 mt-2 text-sm">Loading...</p>}
         {error && (
            <p className="absolute left-0 mt-2 text-sm text-red1">{error}</p>
         )}
         {predictions.length > 0 && (
            <div
               className="absolute left-0 z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 hide-scrollbar overflow-y-auto"
            >
               {predictions.map((prediction, index) => (
                  <div
                     key={index}
                     onClick={() => handlePredictionClick(prediction)}
                     className="p-2 hover:bg-blue2o cursor-pointer"
                  >
                     {prediction.description}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
