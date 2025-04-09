"use server";

import { redirect } from "next/navigation";
import { errorPath, tripPath } from "@/paths";
import { createClient } from "@/utils/supabase/server";

export const joinTrip = async (formData: FormData) => {
  const tripId = formData.get("tripId") as string;

  if (!tripId) {
    // TODO o11y
    console.error("joinTrip: tripId is missing");
    redirect(errorPath());
  }

  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    // TODO o11y
    console.log("error: ", authError);
    redirect(errorPath());
  }

  const tripIdNumber = parseInt(tripId, 10);
  if (isNaN(tripIdNumber)) {
    // TODO o11y
    console.error(`joinTrip: tripId is invalid ${tripId}`);
    redirect(errorPath());
  }

  const { error } = await supabase
    .from("trip_user")
    .insert({
      trip_id: tripIdNumber,
      user_id: auth.user.id,
    })
    .select()
    .single();

  if (error) {
    // TODO o11y
    console.error(error);
    redirect(errorPath());
  }

  redirect(tripPath(tripId));
};
