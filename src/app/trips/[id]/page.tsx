import Link from "next/link";

import { getTripRoutes } from "@/app/actions";
import RouteCard from "@/components/route-card/route-card";

import classes from "./trips.module.css";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { QueryData } from "@supabase/supabase-js";

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
    <div>
      <div className="grid grid-cols-2 gap-2">
        <section className="border rounded-md p-1">
          <h2>people</h2>
        </section>
        <section className="border rounded-md">
          <h2>cars</h2>
        </section>
      </div>

      <section className={classes.mapContainer}>
        <p>map</p>
      </section>

      <section className={classes.routeContainer}>
        <h2>routes</h2>

        {tripRoutes.map((route) => (
          <RouteCard key={route.id} start={route.start} end={route.end} />
        ))}

        <Link href={`/trips/${id}/routes/new`}>Add</Link>
      </section>
    </div>
  );
}
