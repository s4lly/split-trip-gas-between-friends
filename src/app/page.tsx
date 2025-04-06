import { redirect } from "next/navigation";
import { StateProvider } from "@/components/Context";
import LayoutDrawer from "@/components/layout-drawer";
import MyTrips from "@/components/my-trips/my-trips";
import { errorPath, loginPath, setupPath } from "@/paths";
import { isBlank } from "@/utils/shared";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { error: authError, data: auth } = await supabase.auth.getUser();

  if (authError || !auth?.user) {
    redirect(loginPath());
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

  return (
    <StateProvider>
      <div className="p-4">
        <header>
          <nav className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold">split trip gas</h1>
            <LayoutDrawer />
          </nav>
        </header>
        <section>
          <MyTrips />
        </section>
      </div>
    </StateProvider>
  );
}
