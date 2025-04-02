import Link from "next/link";
import { redirect } from "next/navigation";
import { StateProvider } from "@/components/Context";
import LayoutDrawer from "@/components/layout-drawer";
import MyTrips from "@/components/my-trips/my-trips";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <StateProvider>
      <h1>split trip gas between friends</h1>
      <p>Hello {data.user.email}</p>
    </StateProvider>
  );
}
