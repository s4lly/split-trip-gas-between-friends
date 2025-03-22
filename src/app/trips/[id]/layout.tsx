import { createClient } from "@/utils/supabase/server";
import { House, List } from "@phosphor-icons/react/dist/ssr";
import { QueryData } from "@supabase/supabase-js";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MapProvider } from "@/providers/map-provider";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const tripId = parseInt(id, 10);
  if (isNaN(tripId)) {
    console.log("tripId is not a number: ", id);
    redirect("/error");
  }

  const profilesWithinTripQuery = supabase
    .from("trip")
    .select(
      `
          *,
          profile (
            *
          )
          `
    )
    .eq("id", tripId)
    .single();

  const { data, error: tripError } = await profilesWithinTripQuery;
  if (tripError) {
    console.log(tripError);
    redirect("/error");
  }

  type ProfilesWithinTripQuery = QueryData<typeof profilesWithinTripQuery>;
  const trip: ProfilesWithinTripQuery = data;

  return (
    <MapProvider>
      <div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Link href="/">
              <House className="size-6" />
            </Link>

            <h1 className="text-2xl font-extrabold">{trip.name}</h1>
          </div>

          <Link className="self-start" href={`/user/${123}`}>
            <List className="stroke-black size-6" />
          </Link>
        </div>
        {children}
      </div>
    </MapProvider>
  );
}
