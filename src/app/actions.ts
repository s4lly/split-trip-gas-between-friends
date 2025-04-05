import { Trip } from "@/lib/types";
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
