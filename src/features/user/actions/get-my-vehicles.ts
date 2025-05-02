import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const getMyVehicles = async () => {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    console.error("error: ", authError);
    redirect("/error");
  }

  const { data: vehicles, error: vehiclesError } = await supabase
    .from("vehicle")
    .select("*")
    .eq("owner_id", auth.user.id);

  if (vehiclesError) {
    console.error("error: ", vehiclesError);
    redirect("/error");
  }

  return vehicles;
};
