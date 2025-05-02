"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const addVehicle = async ({
  mpg,
  name,
}: {
  mpg: number;
  name: string;
}) => {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    console.error("error: ", authError);
    redirect("/error");
  }

  const { data: vehicleData, error: vehicleInsertError } = await supabase
    .from("vehicle")
    .insert([
      {
        name,
        mpg,
        owner_id: auth.user.id,
      },
    ])
    .select("*")
    .single();

  if (vehicleInsertError) {
    console.log("error inserting vehicle: ", vehicleInsertError);
    redirect("/error");
  }

  console.log("vehicle created: ", vehicleData);
};
