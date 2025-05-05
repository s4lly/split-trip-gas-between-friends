"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MapGraph } from "@/features/trip/types";
import { MapGraphNodes } from "@/features/trip/utils";
import { errorPath } from "@/paths";

type MapProps = {
  mapGraph: MapGraph | null;
};

type GeometryLibrary = google.maps.GeometryLibrary;
type MarkerLibrary = google.maps.MarkerLibrary;

type Polyline = google.maps.Polyline;
type AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

// TODO consider passing location through props so can save to trip and use same as current destinations

const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      maximumAge: 5 * 60 * 1_000,
    });
  });
};

export const Map = ({ mapGraph }: MapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

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
    if (map === null) {
      return;
    }

    const cleanupItemsFromMap = async () => {
      if (markers.length === 0) {
        const position = await getCurrentLocation();

        map.setCenter(
          new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude,
          ),
        );
        map.setZoom(8);
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

    cleanupItemsFromMap();

    return () => {
      polylines.forEach((polyline) => {
        polyline.setMap(null);
      });

      markers.forEach((marker) => {
        marker.map = null;
      });
    };
  }, [map, polylines, markers]);

  return (
    <div className="h-full w-full" ref={mapRef}>
      <p>Loading...</p>
    </div>
  );
};
