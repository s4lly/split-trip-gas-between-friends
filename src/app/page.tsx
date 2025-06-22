import { CarFront } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StateProvider } from "@/components/Context";
import MySharedTrips from "@/components/my-shared-trips";
import MyTrips from "@/components/my-trips";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/features/user/actions/get-profile";
import { errorPath, profilePath, tripNewPath } from "@/paths";

export default async function Home() {
  const profile = await getProfile();

  if (!profile) {
    redirect(errorPath());
  }

  return (
    <StateProvider>
      <div className="space-y-2 p-4">
        <header className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <CarFront size={36} />
            <h1 className="text-4xl font-extrabold">split trip gas</h1>
          </div>
        </header>

        <section className="flex flex-col gap-2">
          <Button className="w-full" asChild>
            <Link className="text-yellow-300" href={tripNewPath()}>
              New trip
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={profilePath(profile.id)}>Profile</Link>
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
