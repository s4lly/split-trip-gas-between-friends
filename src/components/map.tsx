"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { TripGraph } from "@/features/trip/types";
import { TripGraphNodes } from "@/features/trip/utils";

type MapProps = {
  tripGraph: TripGraph;
};

export const Map = ({ tripGraph }: MapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mapOptions = {
      center: {
        lat: 37.77816124681277,
        lng: -122.40505665414587,
      },
      zoom: 8,
      // TODO remove and regenerate if repo public
      mapId: process.env.NEXT_PUBLIC_MAIN_MAP_ID as string,
    };

    const loader = new Loader({
      // TODO remove and regenerate if repo public
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
      version: "weekly",
    });

    loader
      .importLibrary("maps")
      .then(({ Map }) => {
        if (!mapRef.current) {
          console.log("cannot find element to attach map");
          return;
        }

        setMap(new Map(mapRef.current, mapOptions));
      })
      .catch((e) => {
        console.log("error loading maps library: ", e);
      });
  }, []);

  useEffect(() => {
    const addToMap = async () => {
      if (map == null) {
        return;
      }

      // @ts-expect-error: maps api types not updated
      const { encoding } = await google.maps.importLibrary("geometry");
      // @ts-expect-error: maps api types not updated
      const { AdvancedMarkerElement } =
        await google.maps.importLibrary("marker");

      const markerPositions = [];

      for (const tripNode of TripGraphNodes(tripGraph)) {
        // add polyline
        if (tripNode.route) {
          const decodedPath = encoding.decodePath(
            tripNode.route.polyline.encodedPolyline,
          );

          const gRoutePolyLine = new google.maps.Polyline({
            path: decodedPath,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 3,
          });

          gRoutePolyLine.setMap(map);
        }

        // add marker
        const marker = new AdvancedMarkerElement({
          map,
          position: {
            lat: tripNode.coordinates.latitude,
            lng: tripNode.coordinates.longitude,
          },
        });

        markerPositions.push(marker.position);
      }

      if (markerPositions.length) {
        const bounds = new google.maps.LatLngBounds();

        markerPositions.forEach((markerPosition) => {
          bounds.extend(markerPosition);
        });

        map.fitBounds(bounds);
      }
    };

    addToMap();
  }, [map, tripGraph]);

  return (
    <div className="h-full w-full" ref={mapRef}>
      <p>Loading...</p>
    </div>
  );
};
