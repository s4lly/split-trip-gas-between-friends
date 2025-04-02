"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { PlaceCoordinate, RoutePolyLine } from "@/app/trips/[id]/actions";

type MapProps = {
  placeCoordinates: PlaceCoordinate[];
  routePolyLines: RoutePolyLine[];
};

export const Map = ({ placeCoordinates, routePolyLines }: MapProps) => {
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
      mapId: "6bddb037afab2ce9",
    };

    const loader = new Loader({
      // TODO remove and regenerate if repo public
      apiKey: "AIzaSyCS_NtCeqwe6chb3HQzXKH63L-o1whkB1U",
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

      for (const routePolyLine of routePolyLines) {
        // @ts-expect-error: maps api types not updated
        const { encoding } = await google.maps.importLibrary("geometry");
        const decodedPath = encoding.decodePath(
          routePolyLine.route.polyline.encodedPolyline,
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

      // @ts-expect-error: maps api types not updated
      const { AdvancedMarkerElement } =
        await google.maps.importLibrary("marker");
      const bounds = new google.maps.LatLngBounds();

      for (const placeCoordinate of placeCoordinates) {
        const marker = new AdvancedMarkerElement({
          map,
          position: {
            lat: placeCoordinate.location.latitude,
            lng: placeCoordinate.location.longitude,
          },
        });

        bounds.extend(marker.position);
      }

      map.fitBounds(bounds);
    };

    addToMap();
  }, [map, placeCoordinates, routePolyLines]);

  return (
    <div className="h-full w-full" ref={mapRef}>
      <p>Loading...</p>
    </div>
  );
};
