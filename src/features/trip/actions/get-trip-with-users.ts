"use server";

import { redirect } from "next/navigation";
import { errorPath } from "@/paths";
import { createClient } from "@/utils/supabase/server";

export const getTripWithUsers = async (tripIdString: string) => {
  const tripId = parseInt(tripIdString, 10);

  if (isNaN(tripId)) {
    // TODO o11y
    console.error(`getTripWithUsers: tripId is invalid ${tripIdString}`);
    redirect(errorPath());
  }

  const supabase = await createClient();

  const tripWithUsersQuery = supabase
    .from("trip")
    .select(
      `
      *,
      users:profile (
        *
      )
    `,
    )
    .eq("id", tripId)
    .single();

  const { data, error } = await tripWithUsersQuery;

  if (error) {
    // TODO o11y
    console.error(error);
    redirect(errorPath());
  }

  return data;
};
