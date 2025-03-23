"use server";

import { createClient } from "@/utils/supabase/server";
import { PlacePredication } from "@/utils/valibot/places-auto-complete-schema";
import { redirect } from "next/navigation";

export const searchPlaces = async (query: string) => {
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
    }
  );

  const json = await response.json();

  return json;
};

export const createTripRoute = async (
  tripId: number,
  from: PlacePredication,
  to: PlacePredication
) => {
  const supabase = await createClient();

  const { count: routeCount } = await supabase
    .from("route")
    .select("*", { count: "exact", head: true })
    .eq("trip_id", tripId)
    .select();

  if (routeCount == null) {
    console.log("Error getting route count: ", routeCount);
    redirect("/error");
  }

  const { data, error } = await supabase
    .from("route")
    .insert([
      {
        trip_id: tripId,
        start: from,
        end: to,
        order: routeCount,
      },
    ])
    .select();

  if (error) {
    console.log(error);
    redirect("/error");
  }

  console.log("created trip route: ", data);
  redirect(`/trips/${tripId}`);
};
