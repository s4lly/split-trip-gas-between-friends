"use server";

import { redirect } from "next/navigation";
import { Route } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { PlacePrediction } from "@/utils/valibot/places-auto-complete-schema";

export const createTripDestination = async (
  tripId: number,
  placePrediction: PlacePrediction,
  destinationDetails: Partial<Route> = {},
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
        place: placePrediction,
        order: routeCount,
        ...destinationDetails,
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
