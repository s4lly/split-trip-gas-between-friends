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

  const { error: tripsInsertError } = await supabase.from("trips").insert([
    {
      name: formData.get("name") as string,
      user: authUserData.user?.id,
    },
  ]);

  if (tripsInsertError) {
    console.log(tripsInsertError);
    redirect("/error");
  }

  redirect("/");
}
