"use server";

import { redirect } from "next/navigation";
import { Route } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

export const updateRoute = async (routeId: number, updates: Partial<Route>) => {
  const supabase = await createClient();

  console.log("routeId: ", routeId, "updates: ", updates);

  const { data, error } = await supabase
    .from("route")
    .update({ driver_id: updates.driver_id })
    .eq("id", routeId)
    .select();

  if (error) {
    console.log(error);
    redirect("/error");
  }

  console.log("updated route data: ", data);
};
