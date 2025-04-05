"use server";

import { redirect } from "next/navigation";
import { parse, ValiError } from "valibot";
import { errorPath } from "@/paths";
import {
  ComputedRoute,
  ComputeRoutesSchema,
} from "@/utils/valibot/compute-route-schema";
import { Location } from "@/utils/valibot/place-details-schema";

export async function getComputedRoute([origin, destination]: [
  Location,
  Location,
]): Promise<ComputedRoute> {
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

    redirect(errorPath());
  }

  const data = await response.json();

  try {
    const routePolyLine = parse(ComputeRoutesSchema, data);

    // resonse is an array of routes, we need to get the first one
    const {
      routes: [route],
    } = routePolyLine;

    return route;
  } catch (error) {
    // TODO o11y
    if (error instanceof ValiError) {
      console.error(
        `Validation error for route polyline. Error: ${error.message}`,
      );
    } else {
      console.error(`Unexpected error for route polyline. Error: ${error}`);
    }

    redirect(errorPath());
  }
}
