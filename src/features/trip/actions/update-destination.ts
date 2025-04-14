"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Route } from "@/lib/types";
import { errorPath, tripPath } from "@/paths";
import { createClient } from "@/utils/supabase/server";

export const updateDestination = async (
  tripId: number | null,
  destinationId: number,
  updates: Partial<Route>,
): Promise<Route> => {
  if (tripId === null) {
    console.error("error, tripId is null");
    redirect(errorPath());
  }

  const supabase = await createClient();

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

  revalidatePath(tripPath(tripId));

  return data;
};
