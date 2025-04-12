import { Car } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StateProvider } from "@/components/Context";
import LayoutDrawer from "@/components/layout-drawer";
import MySharedTrips from "@/components/my-shared-trips/my-shared-trips";
import MyTrips from "@/components/my-trips/my-trips";
import { Button } from "@/components/ui/button";
import { errorPath, loginPath, setupPath, tripNewPath } from "@/paths";
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
      <div className="space-y-2 p-4">
        <header className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <Car size={36} weight="duotone" />
            <h1 className="text-4xl font-extrabold">split trip gas</h1>
          </div>
          <LayoutDrawer />
        </header>
        <section>
          <Button className="w-full" asChild>
            <Link className="text-yellow-300" href={tripNewPath()}>
              New trip
            </Link>
          </Button>
        </section>
        <section>
          <MySharedTrips />
        </section>
        <section>
          <MyTrips />
        </section>
      </div>
    </StateProvider>
  );
}
