import { useState, useEffect, useRef, useCallback } from 'react';
import maplibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPlaceDetail } from '@/models/map';
import * as placeAction from '@/app/services/places/placesServices';
import { Place } from '@/models/places/place';
import placeHolderImage from '@/app/assets/banner.png';

const goongApiKey = process.env.NEXT_PUBLIC_GOONG_MAP_KEY;
const mapStyleUrl = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${goongApiKey}`;
const defaultCenter: [number, number] = [106.802366, 10.870161];

interface AppMapProps {
  mapPlaceDetail?: MapPlaceDetail;
  onMarkerClick?: (lngLat: maplibreGl.LngLat) => void;
  handlePlaceMarkerClick?: (placeId: string) => void;
}


export default function AppMap({ mapPlaceDetail, onMarkerClick, handlePlaceMarkerClick }: AppMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const currentMarkerRef = useRef<maplibreGl.Marker | null>(null);
  const placeDetailMarkerRef = useRef<maplibreGl.Marker | null>(null);
  const mapRef = useRef<maplibreGl.Map | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const fetchedPlaces = await placeAction.getAllPlaces();
      setPlaces(fetchedPlaces);
    };

    fetchPlaces();
  }, []);

  const handleNewMarkerClick = useCallback((lngLat: maplibreGl.LngLat) => {
    console.log("New marker clicked at:", lngLat);
    if (onMarkerClick) {
      onMarkerClick(lngLat);
    }
  }, [onMarkerClick]);

  useEffect(() => {
    if (mapContainerRef.current) {
      const newMap = new maplibreGl.Map({
        container: mapContainerRef.current,
        style: mapStyleUrl,
        center: mapPlaceDetail
          ? [mapPlaceDetail.geometry.location.lng, mapPlaceDetail.geometry.location.lat]
          : defaultCenter,
        //center: defaultCenter,
        zoom: 12,
      });

      newMap.addControl(new maplibreGl.NavigationControl(), 'bottom-right');

      mapRef.current = newMap;

      if (mapPlaceDetail) {
        placeDetailMarkerRef.current = new maplibreGl.Marker()
          .setLngLat([mapPlaceDetail.geometry.location.lng, mapPlaceDetail.geometry.location.lat])
          .addTo(newMap);
      }

      newMap.on('click', (e) => {

        if (placeDetailMarkerRef.current) {
          placeDetailMarkerRef.current.remove();
          placeDetailMarkerRef.current = null; // Reset placeDetail marker ref
        }

        if (currentMarkerRef.current) {
          currentMarkerRef.current.remove();
        }
        const newMarker = new maplibreGl.Marker({ color: '#FF0000' })
          .setLngLat(e.lngLat)
          .addTo(newMap);
        currentMarkerRef.current = newMarker;

        handleNewMarkerClick(e.lngLat);
      });

      return () => {
        newMap.remove();
      };
    }
  }, [mapPlaceDetail]);

  useEffect(() => {
    if (mapRef.current && places.length > 0) {
      places.forEach((place: Place) => {
        const longitude = parseFloat(place.longitude);
        const latitude = parseFloat(place.latitude);

        const customMarker = document.createElement("img");
        customMarker.src = place.coverImage.imageUrl || placeHolderImage.src;
        customMarker.style.width = "40px";
        customMarker.style.height = "40px";
        customMarker.style.borderRadius = "50%";
        customMarker.style.borderColor = "blue"
        customMarker.style.cursor = "pointer";

        const popup = new maplibreGl.Popup({ offset: 25 })
          .setHTML(`
            <div class="bg-white shadow-lg rounded-xl max-w-xs ">
              <h3 class="text-lg font-bold text-blue-600">${place.name}</h3>
              <p class="text-sm text-gray-700">${place.longitude}</p>
              <p class="text-sm text-gray-700">${place.latitude}</p>
            </div>
          `);

        if (mapRef.current) {
          const marker = new maplibreGl.Marker({ element: customMarker })
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);
          marker.setPopup(popup);

          customMarker.addEventListener('click', () => {
            if (handlePlaceMarkerClick) {
              handlePlaceMarkerClick(place.id.toString());
            }
          });
        }
      });
    }
  }, [places, handlePlaceMarkerClick]);

  return <div ref={mapContainerRef} className='w-full h-full' />;
};

