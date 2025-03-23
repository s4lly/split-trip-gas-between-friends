import Link from "next/link";

import { getTripRoutes } from "@/app/actions";
import RouteCard from "@/components/route-card/route-card";

import classes from "./trips.module.css";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { QueryData } from "@supabase/supabase-js";
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
        `,
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

  const routes = await getTripRoutes(id);

  if (trip == null) {
    return <div>Invalid trip id</div>;
  }

  return (
    <div className="mt-2 space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/trips/${id}/people`}
          className="flex items-center rounded-md border px-1 py-1.5"
        >
          <p>
            people: <span>{data.profile.length}</span>
          </p>
        </Link>
        <section className="flex items-center rounded-md border px-1 py-1.5">
          <p>cars</p>
        </section>
      </div>

      <section className={classes.mapContainer}>
        <Map routes={routes} />
      </section>

      <section className="space-y-2">
        <Link
          className="flex w-full items-center justify-center rounded-lg bg-blue-100 p-2 px-4 text-center text-sm font-extrabold text-blue-500 outline-2 outline-blue-200"
          href={`/trips/${id}/routes/new`}
        >
          <p className="block">Add Route</p>
        </Link>
        {routes.length > 0 && (
          <ul className="divide-y rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-900">
            {routes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
