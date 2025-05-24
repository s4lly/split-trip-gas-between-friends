"use server";

import { redirect } from "next/navigation";
import { Profile } from "@/lib/types";
import { errorPath } from "@/paths";
import { createClient } from "@/utils/supabase/server";

export const getUsersVehicles = async (users: Profile[]) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicle")
    .select("*")
    .in(
      "owner_id",
      users.map((user) => user.id),
    );

  if (error) {
    // TODO o11y
    console.error(error);
    redirect(errorPath());
  }

  return data;
};
