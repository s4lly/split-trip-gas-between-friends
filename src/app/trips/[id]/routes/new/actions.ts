"use server";

import { createClient } from "@/utils/supabase/server";
import { Destination } from "@/lib/types";

export const createTripRoute = async (tripId: number, formData: FormData) => {
  const supabase = await createClient();

  const [start, end] = await createDestination(formData);

  if (start == null || end == null) {
    return;
  }

  const { count: routeCount } = await supabase
    .from("route")
    .select("*", { count: "exact", head: true })
    .eq("trip_id", tripId)
    .select();

  console.log("routeCount:", routeCount);

  if (routeCount == null) {
    console.log("routeCount is null");
    return;
  }

  const { data, error } = await supabase
    .from("route")
    .insert([
      {
        trip_id: tripId,
        start: start.id,
        end: end.id,
        order: routeCount,
      },
    ])
    .select();

  if (error) {
    console.log(error);
    return;
  }

  console.log(data);
};

export const createDestination = async (
  formData: FormData
): Promise<[Destination, Destination] | []> => {
  const supabase = await createClient();

  const from = {
    name: formData.get("from") as string,
  };
  const to = {
    name: formData.get("to") as string,
  };

  const { data, error } = await supabase
    .from("destination")
    .insert([from, to])
    .select();

  if (error) {
    console.log(error);
    return [];
  }

  const [fromData, toData] = data;

  return [fromData, toData];
};
