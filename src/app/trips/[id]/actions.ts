"use server";

import { Location, PlaceDetailsSchema } from "@/utils/valibot/place-details";
import { parse, ValiError } from "valibot";

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
