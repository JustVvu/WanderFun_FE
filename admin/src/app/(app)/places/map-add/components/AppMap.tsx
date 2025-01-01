import { useEffect, useRef } from 'react';
import maplibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const goongApiKey = process.env.NEXT_PUBLIC_GOONG_MAP_KEY;
const mapStyleUrl = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${goongApiKey}`;
const center: [number, number] = [105.8544441, 21.028511];

const AppMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const currentMarkerRef = useRef<maplibreGl.Marker | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new maplibreGl.Map({
        container: mapContainerRef.current,
        style: mapStyleUrl,
        center: center,
        zoom: 12,
      });

      map.addControl(new maplibreGl.NavigationControl());

      map.on('click', (e) => {
        if (currentMarkerRef.current) {
          currentMarkerRef.current.remove();
        }
        const newMarker = new maplibreGl.Marker()
          .setLngLat(e.lngLat)
          .addTo(map);
        currentMarkerRef.current = newMarker;
      });

      return () => {
        map.remove();
      };
    }
  }, []);

  return <div ref={mapContainerRef} className='w-full h-[600px]' />;
};

export default AppMap;