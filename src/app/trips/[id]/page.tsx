import Link from "next/link";

import { getTripRoutes } from "@/app/actions";
import RouteCard from "@/components/route-card/route-card";

import classes from "./trips.module.css";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { QueryData } from "@supabase/supabase-js";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Map } from "@/components/map";

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tripId = parseInt(id, 10);
  if (isNaN(tripId)) {
    return <div>Invalid trip id</div>;
  }

  const supabase = await createClient();

  const profilesWithinTripQuery = supabase
    .from("trip")
    .select(
      `
        name,
        profile (
          id,
          email
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

  const tripRoutes = await getTripRoutes(id);

  if (trip == null) {
    return <div>Invalid trip id</div>;
  }

  return (
    <div className="space-y-4 mt-2">
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/trips/${id}/people`}
          className="flex items-center px-1 py-1.5 border rounded-md"
        >
          <p>
            people: <span>{data.profile.length}</span>
          </p>
        </Link>
        <section className="flex items-center px-1 py-1.5 border rounded-md">
          <p>cars</p>
        </section>
      </div>

      <section className={classes.mapContainer}>
        <Map />
      </section>

      <section className={classes.routeContainer}>
        <h2>routes</h2>
        <Link
          className="flex items-center px-4 w-full text-white bg-green-400 hover:bg-green-500 font-medium rounded-t-lg text-sm p-2 text-center"
          href={`/trips/${id}/routes/new`}
        >
          <Plus />
          <p>Add</p>
        </Link>
        {tripRoutes.length > 0 && (
          <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 divide-y rounded-b-lg">
            {tripRoutes.map((route) => (
              <RouteCard key={route.id} start={route.start} end={route.end} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
