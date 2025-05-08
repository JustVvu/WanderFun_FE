'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import Head from "next/head";
import AppMap from "./components/AppMap";
import { Button } from "@/components/ui/button";
import AppSeachBar from "../components/AppSearchBar";
import { MapPlaceDetail } from "@/models/map";
import maplibreGl from 'maplibre-gl';
import FloatingSidebar from "./components/FloatingSidebar";
import { Place } from "@/models/places/place";
import { getPlaceById } from "../services/places/placesServices";

export default function MapAdd() {

   const router = useRouter();
   const [placeDetail, setPlaceDetail] = useState<Place>();
   const [mapPlaceDetail, setMapPlaceDetail] = useState<MapPlaceDetail>();
   const [isSelected, setIsSelected] = useState(false);
   const [openSidebar, setOpenSidebar] = useState(false);
   const [markerLngLat, setMarkerLngLat] = useState<maplibreGl.LngLat | null>(null);

   const handlePlaceDetailFetched = (detail: MapPlaceDetail) => {
      setMapPlaceDetail(detail);
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

            <FloatingSidebar
               place={placeDetail}
               isOpen={openSidebar}
               setIsOpen={setOpenSidebar}
            />

            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-2/4 max-w-xl">
               <AppSeachBar
                  onPlaceDetailFetched={handlePlaceDetailFetched}
               />
            </div>
            <div className="items-center absolute top-4 right-4 z-10 p-2">
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
               mapPlaceDetail={mapPlaceDetail}
               onMarkerClick={handleMarkerClick}
               handlePlaceMarkerClick={handlePlaceMarkerClick}
            />
         </div>
      </div>
   );
};

