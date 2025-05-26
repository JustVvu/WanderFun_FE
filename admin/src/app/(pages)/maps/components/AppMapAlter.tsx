import { useState, useEffect, useRef, useCallback } from 'react';
import maplibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPlaceDetail } from '@/models/map';
import { Place } from '@/models/places/place';
import placeHolderImage from '@/app/assets/banner.png';

const goongApiKey = process.env.NEXT_PUBLIC_GOONG_MAP_KEY;
const mapStyleUrl = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${goongApiKey}`;
const defaultCenter: [number, number] = [105, 16];

interface AppMapProps {
  placeSearchResult?: MapPlaceDetail;
  onMarkerClick?: (lngLat: maplibreGl.LngLat) => void;
  handlePlaceMarkerClick?: (placeId: string) => void;
  onProvinceSelected?: (provinceName: string) => void;
  provincePlaces?: Place[];
}

export default function AppMapAlter({
  placeSearchResult,
  onMarkerClick,
  handlePlaceMarkerClick,
  onProvinceSelected,
  provincePlaces = []
}: AppMapProps) {

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibreGl.Map | null>(null);
  const [selectedProvinceName, setSelectedProvinceName] = useState<string | null>(null);
  const selectedProvinceRef = useRef<string | null>(null);

  const currentMarkerRef = useRef<maplibreGl.Marker | null>(null);
  const placeDetailMarkerRef = useRef<maplibreGl.Marker | null>(null);
  const placeMarkersRef = useRef<maplibreGl.Marker[]>([]);

  const handleMapClick = useCallback((e: maplibreGl.MapMouseEvent) => {
    if ((e.originalEvent.target as HTMLElement).tagName === "IMG") return;

    placeDetailMarkerRef.current?.remove();
    placeDetailMarkerRef.current = null;

    currentMarkerRef.current?.remove();

    currentMarkerRef.current = new maplibreGl.Marker({ color: '#FF0000' })
      .setLngLat(e.lngLat)
      .addTo(mapRef.current!);

    onMarkerClick?.(e.lngLat);
  }, [onMarkerClick]);

  const addVietnamGeoJsonLayer = (map: maplibreGl.Map) => {
    if (map.getSource('vietnam-provinces')) {
      ['vietnam-provinces-fill', 'vietnam-provinces-outline'].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
      map.removeSource('vietnam-provinces');
    }

    map.addSource('vietnam-provinces', {
      type: 'geojson',
      data: '/geo/VietnamBorderVietnamese.geojson',
    });

    // Fill layer
    map.addLayer({
      id: 'vietnam-provinces-fill',
      type: 'fill',
      source: 'vietnam-provinces',
      paint: {
        'fill-color': '#088',
        'fill-opacity': 0.2,
      },
    });

    // Outline layer
    map.addLayer({
      id: 'vietnam-provinces-outline',
      type: 'line',
      source: 'vietnam-provinces',
      paint: {
        'line-color': '#000',
        'line-width': 1,
      },
    });

    map.on('mouseenter', 'vietnam-provinces-fill', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'vietnam-provinces-fill', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('click', 'vietnam-provinces-fill', (e) => {
      if ((e.originalEvent.target as HTMLElement).tagName === "IMG") return;
      const feature = e.features?.[0];
      if (!feature) return;

      const provinceName = feature.properties?.Name || '';

      if (provinceName === selectedProvinceRef.current) {
        return;
      }

      selectedProvinceRef.current = provinceName;
      setSelectedProvinceName(provinceName);

      const geometry = feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
      const bounds = new maplibreGl.LngLatBounds();

      if (geometry.type === 'Polygon') {
        geometry.coordinates.forEach((ring) => {
          ring.forEach((coord) => bounds.extend(coord as [number, number]));
        });
      } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach((polygon) => {
          polygon[0].forEach((coord) => bounds.extend(coord as [number, number]));
        });
      }

      if (!bounds.isEmpty()) {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        const width = Math.abs(ne.lng - sw.lng);
        const height = Math.abs(ne.lat - sw.lat);

        const minExtent = 0.5; // khoảng cách tối thiểu (đơn vị độ)

        const expandedBounds = new maplibreGl.LngLatBounds(sw, ne);

        if (width < minExtent || height < minExtent) {
          expandedBounds.extend([sw.lng - minExtent, sw.lat - minExtent]);
          expandedBounds.extend([ne.lng + minExtent, ne.lat + minExtent]);
        }

        map.fitBounds(expandedBounds, {
          padding: 40,
          duration: 1000,
          maxZoom: 8.5,
        });
      }

      onProvinceSelected?.(provinceName);
    });
  };

  const addPlaceMarkers = (map: maplibreGl.Map, places: Place[]) => {
    // Clear old markers
    placeMarkersRef.current.forEach((marker) => marker.remove());
    placeMarkersRef.current = [];

    places.forEach((place) => {
      const [lng, lat] = [parseFloat(place.longitude), parseFloat(place.latitude)];

      const markerImg = document.createElement("img");
      markerImg.src = place.coverImage.imageUrl || placeHolderImage.src;
      Object.assign(markerImg.style, {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        borderColor: "blue",
        cursor: "pointer",
      });

      const marker = new maplibreGl.Marker({ element: markerImg })
        .setLngLat([lng, lat])
        .addTo(map);

      markerImg.addEventListener('click', () => {
        handlePlaceMarkerClick?.(place.id.toString());
      });

      placeMarkersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibreGl.Map({
      container: mapContainerRef.current,
      style: mapStyleUrl,
      center: placeSearchResult
        ? [placeSearchResult.geometry.location.lng, placeSearchResult.geometry.location.lat]
        : defaultCenter,
      zoom: placeSearchResult ? 12 : 6,
    });

    map.addControl(new maplibreGl.NavigationControl(), 'bottom-right');

    map.on('load', () => {
      mapRef.current = map;
      addVietnamGeoJsonLayer(map);
    });

    map.on('click', handleMapClick);

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (mapRef.current && placeSearchResult) {
      const { lng, lat } = placeSearchResult.geometry.location;

      placeDetailMarkerRef.current?.remove();

      placeDetailMarkerRef.current = new maplibreGl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        speed: 1.4,
        curve: 1.5,
        easing: (t) => t,
        essential: true,
      });
    }
  }, [placeSearchResult]);

  // Vẽ marker từ place sau khi fetch xong
  useEffect(() => {
    if (mapRef.current) {
      addPlaceMarkers(mapRef.current, provincePlaces);
    }
  }, [provincePlaces]);

  useEffect(() => {
    if (!mapRef.current || !selectedProvinceName) return;

    const map = mapRef.current;

    // Remove old layer + source if they exist
    if (map.getLayer('vietnam-provinces-selected')) {
      map.removeLayer('vietnam-provinces-selected');
    }
    if (map.getSource('vietnam-provinces-selected')) {
      map.removeSource('vietnam-provinces-selected');
    }

    // Fetch and filter GeoJSON to get selected province only
    fetch('/geo/VietnamBorderVietnamese.geojson')
      .then(res => res.json())
      .then(data => {
        const filtered = {
          ...data,
          features: data.features.filter(
            (f: GeoJSON.Feature) => f.properties?.Name === selectedProvinceName
          ),
        };

        map.addSource('vietnam-provinces-selected', {
          type: 'geojson',
          data: filtered,
        });

        map.addLayer({
          id: 'vietnam-provinces-selected',
          type: 'line',
          source: 'vietnam-provinces-selected',
          paint: {
            'line-color': '#AE2029',
            'line-width': 3,
          },
        });
      });
  }, [selectedProvinceName]);

  return <div ref={mapContainerRef} className='w-full h-full' />;
}
