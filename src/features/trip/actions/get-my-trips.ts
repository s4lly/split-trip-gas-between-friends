import { redirect } from "next/navigation";
import { Trip } from "@/lib/types";
import { errorPath } from "@/paths";
import { createClient } from "@/utils/supabase/server";

export async function getMyTrips(): Promise<Trip[]> {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    console.error(authError || "User not authenticated");
    redirect(errorPath());
  }

  const { data: myTrips, error: myTripsError } = await supabase
    .from("trip")
    .select("*")
    .eq("owner_id", auth.user.id);

  if (myTripsError) {
    console.error(myTripsError);
    redirect(errorPath());
  }

  return myTrips;
}
