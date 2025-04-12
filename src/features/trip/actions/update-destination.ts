"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Route } from "@/lib/types";
import { errorPath, tripPath } from "@/paths";
import { createClient } from "@/utils/supabase/server";

export const updateDestination = async (
  tripId: number,
  destinationId: number,
  updates: Partial<Route>,
): Promise<Route> => {
  const supabase = await createClient();

  // console.log("tripId: ", tripId, "destinationId: ", destinationId, "updates: ", updates);

  const { data, error } = await supabase
    .from("route")
    .update(updates)
    .eq("id", destinationId)
    .select()
    .single();

  if (error) {
    console.error(error);
    redirect(errorPath());
  }

  if (!data || !data.driver_id) {
    console.error("error, no data udpated: ", data);
    redirect(errorPath());
  }

  console.log("updated destination data: ", data);
  revalidatePath(tripPath(tripId));

  return data;
};
