import { Route, Trip } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

export async function getTrips(): Promise<Trip[]> {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.log(authError);
    return [];
  }

  if (auth.user) {
    const { data: trips, error: tripsError } = await supabase
      .from("trip")
      .select("*")
      .eq("owner_id", auth.user.id);

    if (tripsError) {
      console.log(tripsError);
      return [];
    }

    return trips;
  }

  return [];
}

export async function getTripPlacePredictions(
  tripIdParam: string,
): Promise<Route[]> {
  const tripId = parseInt(tripIdParam, 10);

  if (isNaN(tripId)) {
    return [];
  }

  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.log(authError);
    return [];
  }

  if (auth.user) {
    const { data: route, error: routeError } = await supabase
      .from("route")
      .select("*")
      .eq("trip_id", tripId)
      .select();

    if (routeError) {
      console.log(routeError);
      return [];
    }

    return route;
  }

  return [];
}
