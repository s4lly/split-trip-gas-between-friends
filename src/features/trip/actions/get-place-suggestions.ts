"use server";

import { redirect } from "next/navigation";
import { parse } from "valibot";
import { errorPath } from "@/paths";
import { PlaceSuggestionsSchema } from "@/utils/valibot/places-auto-complete-schema";

export const getPlaceSuggestions = async (query: string) => {
  const response = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
      },
      body: JSON.stringify({
        input: query,
      }),
    },
  );

  const json = await response.json();

  try {
    return parse(PlaceSuggestionsSchema, json);
  } catch (error) {
    console.error("Failed to parse place suggestions response", error);
    redirect(errorPath());
  }

  return json;
};
