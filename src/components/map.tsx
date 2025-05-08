"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MapGraph } from "@/features/trip/types";
import { MapGraphNodes } from "@/features/trip/utils";
import { errorPath } from "@/paths";
import { getCurrentLocation } from "@/utils/get-current-location";

type MapProps = {
  mapGraph: MapGraph | null;
};

type GeometryLibrary = google.maps.GeometryLibrary;
type MarkerLibrary = google.maps.MarkerLibrary;

type Polyline = google.maps.Polyline;
type AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

// TODO consider passing location through props so can save to trip and use same as current destinations

export const Map = ({ mapGraph }: MapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    isMapLoaded: false,
    isItemsRenderedOnce: false,
  });

  const [polylines, setPolylines] = useState<Polyline[]>([]);
  const [markers, setMarkers] = useState<AdvancedMarkerElement[]>([]);

  useEffect(() => {
    const initializeMap = async () => {
      const position = await getCurrentLocation();

      const mapOptions = {
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        zoom: 8,
        mapId: process.env.NEXT_PUBLIC_MAIN_MAP_ID as string,
        disableDefaultUI: true,
        keyboardShortcuts: true,
      };

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        version: "weekly",
      });

      loader
        .importLibrary("maps")
        .then(({ Map }) => {
          if (!mapRef.current) {
            console.error("cannot find element to attach map");
            redirect(errorPath());
          }

          setMap(new Map(mapRef.current, mapOptions));
          setState((prev) => ({ ...prev, isMapLoaded: true }));
        })
        .catch((error) => {
          console.error("error loading maps library: ", error);
          redirect(errorPath());
        });
    };

    initializeMap();
  }, []);

  // create polylines and markers
  useEffect(() => {
    const addItemsToMap = async () => {
      if (map == null || mapGraph == null) {
        return;
      }

      const { encoding } = (await google.maps.importLibrary(
        "geometry",
      )) as GeometryLibrary;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker",
      )) as MarkerLibrary;

      const newPolylines: Polyline[] = [];
      const newMarkers: AdvancedMarkerElement[] = [];

      if (mapGraph.size) {
        setState((prev) => ({ ...prev, isItemsRenderedOnce: true }));
      }

      for (const tripNode of MapGraphNodes(mapGraph)) {
        // add polyline
        if (tripNode.type === "trip" && tripNode.route) {
          const decodedPath = encoding.decodePath(
            tripNode.route.polyline.encodedPolyline,
          );

          const polyline = new google.maps.Polyline({
            path: decodedPath,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 3,
          });

          polyline.setMap(map);
          newPolylines.push(polyline);
        }

        // add marker
        const marker = new AdvancedMarkerElement({
          map,
          position: {
            lat: tripNode.coordinates.latitude,
            lng: tripNode.coordinates.longitude,
          },
        });
        newMarkers.push(marker);
      }

      setPolylines(newPolylines);
      setMarkers(newMarkers);
    };

    addItemsToMap();
  }, [map, mapGraph]);

  useEffect(() => {
    if (map === null || !state.isMapLoaded) {
      return;
    }

    const cleanupItemsFromMap = async () => {
      if (markers.length === 0) {
        map.setZoom(10);
      } else if (markers.length === 1 && markers[0].position) {
        map.setCenter(markers[0].position);
        map.setZoom(14);
      } else if (markers.length > 1) {
        const bounds = new google.maps.LatLngBounds();

        markers.forEach((marker) => {
          if (marker.position) {
            bounds.extend(marker.position);
          }
        });

        map.fitBounds(bounds);
      }
    };

    if (state.isItemsRenderedOnce) {
      cleanupItemsFromMap();
    }

    return () => {
      polylines.forEach((polyline) => {
        polyline.setMap(null);
      });

      markers.forEach((marker) => {
        marker.map = null;
      });
    };
  }, [state, map, polylines, markers]);

  return (
    <div className="h-full w-full" ref={mapRef}>
      <p>Loading...</p>
    </div>
  );
};
