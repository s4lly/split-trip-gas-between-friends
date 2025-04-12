import { redirect } from "next/navigation";
import { Trip } from "@/lib/types";
import { errorPath } from "@/paths";
import { createClient } from "@/utils/supabase/server";

export async function getMySharedTrips(): Promise<Trip[]> {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    console.error(authError || "User not authenticated");
    redirect(errorPath());
  }

  const { data: mySharedTrips, error: mySharedTripsError } = await supabase
    .from("profile")
    .select(
      `
      id,
      trips:trip (
        *
      )
    `,
    )
    .eq("id", auth.user.id)
    .neq("trip.owner_id", auth.user.id)
    .single();

  if (mySharedTripsError) {
    console.error(mySharedTripsError);
    redirect(errorPath());
  }

  return mySharedTrips.trips;
}
