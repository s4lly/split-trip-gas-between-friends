"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { phone } from "phone";
import { createClient } from "@/utils/supabase/server";

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

  const { error } = await supabase.auth.verifyOtp(data);
  if (error) {
    console.error("verify: ", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
