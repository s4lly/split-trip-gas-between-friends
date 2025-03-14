import { createClient } from "@/utils/supabase/server";
import { Trip } from "@/lib/types";

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

export async function getTrip(tripId: number): Promise<Trip> {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.log(authError);
    return {} as Trip;
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
      return {} as Trip;
    }

    return trip;
  }

  return {} as Trip;
}
