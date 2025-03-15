"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createTrip(formData: FormData) {
  const supabase = await createClient();

  const { data: authUserData, error: authUserError } =
    await supabase.auth.getUser();

  if (authUserError || !authUserData?.user) {
    console.log(authUserError);
    redirect("/login");
  }

  const { data: tripData, error: tripsInsertError } = await supabase
    .from("trip")
    .insert([
      {
        name: formData.get("name") as string,
        owner_id: authUserData.user?.id,
      },
    ])
    .select("*")
    .single();

  if (tripsInsertError) {
    console.log(tripsInsertError);
    redirect("/error");
  }

  console.log("Newly created trip:", tripData);

  const { error: routeUserInsertError } = await supabase
    .from("trip_user")
    .insert([
      {
        user_id: authUserData.user?.id,
        trip_id: tripData?.id,
      },
    ]);

  if (routeUserInsertError) {
    console.log(routeUserInsertError);
    redirect("/error");
  }

  redirect("/");
}
