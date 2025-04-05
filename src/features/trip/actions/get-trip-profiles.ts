"use server";

import { redirect } from "next/navigation";
import { errorPath } from "@/paths";
import { createClient } from "@/utils/supabase/server";

export const getTripProfiles = async (tripIdString: string) => {
  const tripId = parseInt(tripIdString, 10);

  if (isNaN(tripId)) {
    // TODO o11y
    console.error(`getTripProfiles: tripId is invalid ${tripIdString}`);

    redirect(errorPath());
  }

  const supabase = await createClient();

  const profilesWithinTripQuery = supabase
    .from("trip")
    .select(
      `
      name,
      profile (
        id,
        email
      )
    `,
    )
    .eq("id", tripId)
    .single();

  const { data, error } = await profilesWithinTripQuery;

  if (error) {
    // TODO o11y
    console.error(error);

    redirect(errorPath());
  }

  return data;
};
