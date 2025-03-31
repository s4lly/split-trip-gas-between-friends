"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Route } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

export const updateRoute = async (
  tripId: number,
  routeId: number,
  updates: Partial<Route>,
): Promise<string> => {
  const supabase = await createClient();

  // console.log("tripId: ", tripId, "routeId: ", routeId, "updates: ", updates);

  const { data, error } = await supabase
    .from("route")
    .update({ driver_id: updates.driver_id })
    .eq("id", routeId)
    .select()
    .single();

  if (error) {
    console.log(error);
    redirect("/error");
  }

  if (!data || !data.driver_id) {
    console.log("error, no data udpated: ", data);
    redirect("/error");
  }

  console.log("updated route data: ", data);
  revalidatePath(`/trips/${tripId}`);

  return data.driver_id;
};
