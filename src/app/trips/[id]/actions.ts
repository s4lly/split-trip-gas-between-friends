"use server";

import { redirect } from "next/navigation";
import { parse, ValiError } from "valibot";
import { Route } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import {
  RoutesResponse,
  RoutesResponseSchema,
} from "@/utils/valibot/compute-route-schema";
import {
  Location,
  PlaceDetailsSchema,
} from "@/utils/valibot/place-details-schema";
import { PlacePredictionSchema } from "@/utils/valibot/places-auto-complete-schema";

export const getTripProfiles = async (tripId: number) => {
  const supabase = await createClient();

  const profilesWithinTripQuery = supabase
    .from("trip")
    .select(
      `
      name,
      profile (
        id,
        email
      )
    `,
    )
    .eq("id", tripId)
    .single();

  const { data, error } = await profilesWithinTripQuery;
  if (error) {
    console.log(error);
    redirect("/error");
  }

  return data;
};

export async function getCoordinates(tripRoutes: Route[]) {
  // TODO o11y
  const places = tripRoutes.map((tripRoute) =>
    parse(PlacePredictionSchema, tripRoute.place),
  );

  const placeIds = places.map((place) => place.placeId);
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
}

export async function getRoutePolyLines(
  coordinates: Location[],
): Promise<RoutesResponse[]> {
  const routes: [Location, Location][] = [];
  for (let i = 1; i < coordinates.length; i++) {
    routes.push([coordinates[i - 1], coordinates[i]]);
  }

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

    if (!response.ok) {
      console.error(
        `Failed to fetch route polyline. Status: ${response.status}, StatusText: ${response.statusText}`,
      );
      return [];
    }

    const data = await response.json();
    // TODO o11y
    const routePolyLine = parse(RoutesResponseSchema, data);

    routePolyLines.push(routePolyLine);
  }

  return routePolyLines;
}
