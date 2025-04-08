import { redirect } from "next/navigation";
import { Profile } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

export const getProfile = async (): Promise<Profile> => {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    console.error("error: ", authError);
    redirect("/error");
  }

  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  if (error) {
    console.error("error: ", error);
    redirect("/error");
  }

  return profile;
};
