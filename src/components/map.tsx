"use client";

import { getCoordinates } from "@/app/trips/[id]/actions";
import { Route } from "@/lib/types";
import { PlacePredictionSchema } from "@/utils/valibot/places-auto-complete-schema";
import { Location } from "@/utils/valibot/place-details";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { parse, ValiError } from "valibot";

type MapProps = {
  routes: Route[];
};

export const Map = ({ routes }: MapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [coordinates, setCoordinates] = useState<Location[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mapOptions = {
      center: {
        lat: 37.77816124681277,
        lng: -122.40505665414587,
      },
      zoom: 8,
      mapId: process.env.NEXT_PUBLIC_MAIN_MAP_ID as string,
    };

    const loader = new Loader({
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
    const addMarkers = async () => {
      if (map == null) {
        return;
      }

      const placeIds = [];
      for (const route of routes) {
        try {
          const placePrediction = parse(PlacePredictionSchema, route.place);
          placeIds.push(placePrediction.placeId);
        } catch (error) {
          if (error instanceof ValiError) {
            console.error("Validation failed:", error.issues);
          } else {
            console.error("Unexpected error:", error);
          }
        }
      }

      const coordinates = await getCoordinates(placeIds);
      console.log(coordinates);
      setCoordinates(coordinates);
    };

    addMarkers();
  }, [map, routes]);

  useEffect(() => {
    const addMarkers = async () => {
      if (map == null) {
        return;
      }

      // @ts-ignore: maps api types not updated
      const { AdvancedMarkerElement } =
        await google.maps.importLibrary("marker");

      for (const coordinate of coordinates) {
        new AdvancedMarkerElement({
          map,
          position: { lat: coordinate.latitude, lng: coordinate.longitude },
        });
      }
    };

    addMarkers();
  }, [map, coordinates]);

  return (
    <div className="h-full w-full" ref={mapRef}>
      <p>Loading...</p>
    </div>
  );
};
