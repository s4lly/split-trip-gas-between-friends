import { createClient } from "@/utils/supabase/server";
import { Route, Trip } from "@/lib/types";

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

export async function getTrip(tripIdParam: string): Promise<Trip | null> {
  const tripId = parseInt(tripIdParam, 10);

  if (isNaN(tripId)) {
    return null;
  }

  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.log(authError);
    return null;
  }

  if (auth.user) {
    const { data: trip, error: tripError } = await supabase
      .from("trip")
      .select("*")
      .eq("owner_id", auth.user.id)
      .eq("id", tripId)
      .single();

    if (tripError) {
      console.log(tripError);
      return null;
    }

    return trip;
  }

  return null;
}

export async function getTripRoutes(tripIdParam: string): Promise<Route[]> {
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
