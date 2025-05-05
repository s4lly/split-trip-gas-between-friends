"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { phone } from "phone";
import { createClient } from "@/utils/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signInPhone(_prevState: any, formData: FormData) {
  const supabase = await createClient();

  const phoneString = formData.get("phone") as string;
  // TODO support more than one country
  const parsedPhone = phone(phoneString, { country: "USA" });

  if (!parsedPhone.isValid) {
    const message = "Invalid phone number";
    console.error(message, phoneString);

    return { message };
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
