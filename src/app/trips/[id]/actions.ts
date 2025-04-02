"use server";

import { redirect } from "next/navigation";
import { parse, ValiError } from "valibot";
import { createClient } from "@/utils/supabase/server";
import {
  ComputedRoute,
  RoutesResponseSchema,
} from "@/utils/valibot/compute-route-schema";
import {
  Location,
  PlaceDetailsSchema,
} from "@/utils/valibot/place-details-schema";
import { PlacePrediction } from "@/utils/valibot/places-auto-complete-schema";

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

export type PlaceCoordinate = {
  placeId: string;
  location: Location;
};

export async function getPlaceCoordinates(
  places: PlacePrediction[],
): Promise<PlaceCoordinate[]> {
  const placeIds = places.map((place) => place.placeId);
  const placeCoordinates: PlaceCoordinate[] = [];

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
      placeCoordinates.push({ placeId, location: placeDetails.location });
    } catch (error) {
      if (error instanceof ValiError) {
        console.error(
          `Validation error for placeId: ${placeId}. Error: ${error.message}`,
        );
      } else {
        console.error(
          `Unexpected error for placeId: ${placeId}. Error: ${error}`,
        );
      }
    }
  }

  return placeCoordinates;
}

export type RoutePolyLine = {
  origin: {
    placeId: string;
  };
  destination: {
    placeId: string;
  };
  route: ComputedRoute;
};

export async function getRoutePolyLines(
  placeCoordinates: PlaceCoordinate[],
): Promise<RoutePolyLine[]> {
  const routes: [PlaceCoordinate, PlaceCoordinate][] = [];
  for (let i = 1; i < placeCoordinates.length; i++) {
    routes.push([placeCoordinates[i - 1], placeCoordinates[i]]);
  }

  const routePolyLines: RoutePolyLine[] = [];

  for (const [origin, destination] of routes) {
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
                latitude: origin.location.latitude,
                longitude: origin.location.longitude,
              },
            },
          },
          destination: {
            location: {
              latLng: {
                latitude: destination.location.latitude,
                longitude: destination.location.longitude,
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

    try {
      // TODO o11y
      const routePolyLine = parse(RoutesResponseSchema, data);

      // resonse is an array of routes, we need to get the first one
      const {
        routes: [route],
      } = routePolyLine;

      routePolyLines.push({
        origin: {
          placeId: origin.placeId,
        },
        destination: {
          placeId: destination.placeId,
        },
        route,
      });
    } catch (error) {
      if (error instanceof ValiError) {
        console.error(
          `Validation error for route polyline. Error: ${error.message}`,
        );
      } else {
        console.error(`Unexpected error for route polyline. Error: ${error}`);
      }
    }
  }

  return routePolyLines;
}
