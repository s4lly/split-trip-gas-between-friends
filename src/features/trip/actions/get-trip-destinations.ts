"use server";

import { parsePlaceFromTripDestination } from "@/features/trip/utils";
import { createClient } from "@/utils/supabase/server";

export async function getTripDestinations(tripIdString: string) {
  const tripIdNumber = parseInt(tripIdString, 10);

  if (isNaN(tripIdNumber)) {
    // TODO o11y
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("route")
    .select(
      `
      *,
      profile (
        *
      ),
      vehicle (
        *
      )
    `,
    )
    .eq("trip_id", tripIdNumber);

  if (error) {
    // TODO o11y
    console.error("getTripDestinations: ", error);

    return [];
  }

  const destinations = data
    .sort((a, b) => a.order - b.order)
    .map((destination) => ({
      ...destination,
      details: parsePlaceFromTripDestination(destination),
    }));

  return destinations;
}
