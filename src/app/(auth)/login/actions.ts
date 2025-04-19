"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { phone } from "phone";
import { errorPath, setupPath } from "@/paths";
import { isBlank } from "@/utils/shared";
import { createClient } from "@/utils/supabase/server";

export async function signupEmail(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("error: ", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function loginEmail(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error: authError, data: auth } =
    await supabase.auth.signInWithPassword(data);

  if (authError) {
    console.error("error: ", authError);
    redirect("/error");
  }

  if (authError || !auth?.user) {
    // if error here then something wrong and we shouldn't try to login again
    redirect(errorPath());
  }

  const { error: profileError, data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  if (profileError || !profile) {
    console.error("no profile: ", profileError);
    redirect(errorPath());
  }

  if (isBlank(profile.username)) {
    redirect(setupPath());
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// ----

// phone - sign in
export async function signin(formData: FormData) {
  const supabase = await createClient();

  const phoneString = formData.get("phone") as string;
  // TODO support more than one country
  const parsedPhone = phone(phoneString, { country: "USA" });

  if (!parsedPhone.isValid) {
    console.error("entered invalid phone: ", phoneString);
    return;
  }

  const data = {
    phone: parsedPhone.phoneNumber,
  };

  // console.log("signup: ", data);

  const { error } = await supabase.auth.signInWithOtp(data);
  if (error) {
    console.error("error: ", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect(`/auth/verify/${parsedPhone.phoneNumber.replace("+", "")}`);
}

// phone - verify
export async function verify(formData: FormData) {
  const supabase = await createClient();

  const data = {
    phone: decodeURI(formData.get("phone") as string),
    token: formData.get("code") as string,
    type: "sms" as const,
  };

  // console.log("verify: ", data);

  const { error: authError, data: auth } = await supabase.auth.verifyOtp(data);
  if (authError) {
    console.error("verify: ", authError);
    redirect("/error");
  }

  if (authError || !auth?.user) {
    // if error here then something wrong and we shouldn't try to login again
    redirect(errorPath());
  }

  const { error: profileError, data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  if (profileError || !profile) {
    console.error("no profile: ", profileError);
    redirect(errorPath());
  }

  if (isBlank(profile.username)) {
    redirect(setupPath());
  }

  revalidatePath("/", "layout");
  redirect("/");
}
