"use server";

import { redirect } from "next/navigation";
import { parse } from "valibot";
import { errorPath } from "@/paths";
import { PlaceSuggestionsSchema } from "@/utils/valibot/places-auto-complete-schema";

type PlaceAutocompleteRequestBody = {
  input: string;
  locationBias?: {
    circle: {
      center: {
        latitude: number;
        longitude: number;
      };
      radius: number;
    };
  };
};

export const getPlaceSuggestions = async (
  query: string,
  locationBias?: { latitude: number; longitude: number; radius: number },
) => {
  const body: PlaceAutocompleteRequestBody = {
    input: query,
  };

  if (locationBias) {
    body.locationBias = {
      circle: {
        center: {
          latitude: locationBias.latitude,
          longitude: locationBias.longitude,
        },
        radius: locationBias.radius,
      },
    };
  }

  const response = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
      },
      body: JSON.stringify(body),
    },
  );

  const json = await response.json();

  try {
    return parse(PlaceSuggestionsSchema, json);
  } catch (error) {
    console.error("Failed to parse place suggestions response", error);
    redirect(errorPath());
  }
};
