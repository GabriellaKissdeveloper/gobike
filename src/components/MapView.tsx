import { useEffect, useRef } from 'react';
import { Map, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapView(props: any) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInitRef = useRef<Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapInitRef.current = initMap(mapRef.current, [props.x, props.y]);
      mapInitRef.current &&
        mapInitRef.current.on('load', () =>
          generateNewMarker({
            map: mapInitRef.current!,
            ...mapInitRef.current!.getCenter(),
          }),
        );
    }
  }, []);

  return <div ref={mapRef} className="map" />;
}

function initMap(container: HTMLDivElement, coords: [number, number]) {
  return new Map({
    container,
    style: 'mapbox://styles/mapbox/streets-v12',
    pitchWithRotate: false,
    center: coords,
    zoom: 16,
    accessToken:
      'pk.eyJ1IjoiZ2FicmllbGxha2lzcyIsImEiOiJja3J3M2V5MzIwY3NkMnBydmNua2dtMmc3In0.mF8UT2dEokq0ljC_EpVdGQ',
    doubleClickZoom: false,
  });
}

function generateNewMarker({
  lat,
  lng,
  map,
}: {
  lng: number;
  lat: number;
  map: Map;
}) {
  new Marker({ color: 'green', scale: 1 }).setLngLat([lng, lat]).addTo(map);
}
