'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import Head from "next/head";
import AppMap from "./components/AppMap";
import { Button } from "@/components/ui/button";
import { MapPlaceDetail } from "@/models/map";
import maplibreGl from 'maplibre-gl';
import PlaceDetailSidebar from "./components/PlaceDetailSidebar";
import { Place } from "@/models/places/place";
import { getPlaceById, getPlaceByProvinceName } from "@/app/services/places/placesServices";
import AppSearchBar from "@/app/components/AppSearchBar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function MapAdd() {

   const router = useRouter();
   const [placeDetail, setPlaceDetail] = useState<Place>();
   const [placeSearchResult, setPlaceSearchResult] = useState<MapPlaceDetail>();
   const [isSelected, setIsSelected] = useState(false);
   const [openSidebar, setOpenSidebar] = useState(false);
   const [markerLngLat, setMarkerLngLat] = useState<maplibreGl.LngLat | null>(null);
   const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
   const [provincePlaces, setProvincePlaces] = useState<Place[]>([]);

   const handlePlaceDetailFetched = (detail: MapPlaceDetail) => {
      setPlaceSearchResult(detail);
      //console.log("Place detail in MapAdd:", placeDetail);
   };

   const handleMarkerClick = (lngLat: maplibreGl.LngLat) => {
      setIsSelected(true);
      setMarkerLngLat(lngLat);
      console.log("Marker clicked at:", markerLngLat);
   };

   const handlePlaceMarkerClick = async (placeId: string) => {
      const placeDetailData = await getPlaceById(placeId);
      setPlaceDetail(placeDetailData);
      setOpenSidebar(true);
   }

   const handleProvinceSelected = async (provinceName: string) => {
      setSelectedProvince(provinceName);
      const places = await getPlaceByProvinceName(provinceName);
      setProvincePlaces(places);
   };

   return (
      <div className="w-screen h-screen bg-white">
         <Head>
            <link
               rel="stylesheet"
               href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css"
               type="text/css"
            />
         </Head>
         <div className="w-screen h-screen">

            <PlaceDetailSidebar
               place={placeDetail}
               isOpen={openSidebar}
               setIsOpen={setOpenSidebar}
            />

            <div className="absolute z-10 w-2/4 max-w-xl transform -translate-x-1/2 top-4 left-1/2">
               <AppSearchBar
                  onPlaceDetailFetched={handlePlaceDetailFetched}
               />
            </div>
            <div className="absolute z-10 max-w-lg transform -translate-x-1/2 bottom-4 left-1/2">
               {selectedProvince && (
                  <Card className="w-auto p-3 text-center">
                     <Label className="text-lg font-semibold text-blue3">
                        {selectedProvince}
                     </Label>
                  </Card>
               )}
            </div>
            <div className="absolute z-10 items-center p-2 top-4 right-4">
               <Button
                  variant="default"
                  className={`w-auto rounded-full ${isSelected ? 'visible' : 'invisible'}
                     bg-blue2 hover:bg-blue3 text-white1`}
                  onClick={() => router.push(`/places/add?lng=${markerLngLat?.lng}&lat=${markerLngLat?.lat}`)}
               >
                  Thêm địa điểm
               </Button>
            </div>
            <AppMap
               placeSearchResult={placeSearchResult}
               onMarkerClick={handleMarkerClick}
               handlePlaceMarkerClick={handlePlaceMarkerClick}
               onProvinceSelected={handleProvinceSelected}
               provincePlaces={provincePlaces}
            />
         </div>
      </div>
   );
};

