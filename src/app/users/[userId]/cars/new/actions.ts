"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createVehicle(userId: number, formData: FormData) {
  const supabase = await createClient();

  const { data: authUserData, error: authUserError } =
    await supabase.auth.getUser();

  if (authUserError || !authUserData?.user) {
    console.log(authUserError);
    redirect("/login");
  }

  const mpg = formData.get("mpg") as string;
  const mpgNum = parseInt(mpg, 10);
  if (isNaN(mpgNum)) {
    console.log("mpg is not a number: ", mpg);
    redirect("/error");
  }

  const { data: vehicleData, error: vehicleInsertError } = await supabase
    .from("vehicle")
    .insert([
      {
        name: formData.get("name") as string,
        mpg: mpgNum,
        make: formData.get("make") as string,
        model: formData.get("model") as string,
      },
    ])
    .select("*")
    .single();

  if (vehicleInsertError) {
    console.log("error inserting vehicle: ", vehicleInsertError);
    redirect("/error");
  }

  console.log("vehicle created: ", vehicleData);

  redirect(`/users/${userId}`);
}
