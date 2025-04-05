"use server";

import { redirect } from "next/navigation";
import { parse, ValiError } from "valibot";
import { errorPath } from "@/paths";
import { PlaceDetailsSchema } from "@/utils/valibot/place-details-schema";
import { Location } from "@/utils/valibot/place-details-schema";
import { PlacePrediction } from "@/utils/valibot/places-auto-complete-schema";

export async function getPlaceCoordinates({
  placeId,
}: PlacePrediction): Promise<Location> {
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
    // TODO o11y
    console.error(
      `Failed to fetch coordinates for placeId: ${placeId}. Status: ${response.status}, StatusText: ${response.statusText}`,
    );

    redirect(errorPath());
  }

  const data = await response.json();

  try {
    const placeDetails = parse(PlaceDetailsSchema, data);
    return placeDetails.location;
  } catch (error) {
    if (error instanceof ValiError) {
      // TODO o11y
      console.error(
        `Validation error for placeId: ${placeId}. Error: ${error.message}`,
      );
    } else {
      console.error(
        `Unexpected error for placeId: ${placeId}. Error: ${error}`,
      );
    }

    redirect(errorPath());
  }
}
