"use server";

import { parse, ValiError } from "valibot";
import { Location, PlaceDetailsSchema } from "@/utils/valibot/place-details";
import {
  RoutesResponse,
  RoutesResponseSchema,
} from "@/utils/valibot/poly-line-schema";

export const getCoordinates = async (
  placeIds: string[],
): Promise<Location[]> => {
  const coordinates: Location[] = [];

  for (const placeId of placeIds) {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
          "X-Goog-FieldMask": "location",
        },
      },
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch coordinates for placeId: ${placeId}. Status: ${response.status}, StatusText: ${response.statusText}`,
      );
      return [];
    }

    const data = await response.json();

    try {
      const placeDetails = parse(PlaceDetailsSchema, data);
      coordinates.push(placeDetails.location);
    } catch (error) {
      if (error instanceof ValiError) {
        console.error("Validation failed:", error.issues);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  return coordinates;
};

export async function getRoutePolyLines(
  routes: [Location, Location][],
): Promise<RoutesResponse[]> {
  const routePolyLines = [];

  for (const route of routes) {
    const [origin, destination] = route;

    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
          "X-Goog-FieldMask":
            "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
        },
        body: JSON.stringify({
          origin: {
            location: {
              latLng: {
                latitude: origin.latitude,
                longitude: origin.longitude,
              },
            },
          },
          destination: {
            location: {
              latLng: {
                latitude: destination.latitude,
                longitude: destination.longitude,
              },
            },
          },
          travelMode: "DRIVE",
          computeAlternativeRoutes: false,
          routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false,
          },
          languageCode: "en-US",
          units: "IMPERIAL",
        }),
      },
    );

    const data = await response.json();
    const routePolyLine = parse(RoutesResponseSchema, data);

    routePolyLines.push(routePolyLine);
  }

  return routePolyLines;
}
