"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { errorPath, loginPath } from "@/paths";
import { createClient } from "@/utils/supabase/server";

export const updateUsername = async (formData: FormData) => {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth?.user) {
    console.error(authError);
    redirect(loginPath());
  }

  const username = formData.get("username") as string;
  console.log("username: ", username, "id: ", auth.user.id);

  const { data, error: profileError } = await supabase
    .from("profile")
    .update({ username })
    .eq("id", auth.user.id)
    .select();

  if (profileError) {
    console.error(profileError);
    redirect(errorPath());
  }

  console.info("updateUsername: ", data);

  revalidatePath("/", "layout");
  redirect("/");
};
