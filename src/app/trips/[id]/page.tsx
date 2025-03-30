import { QueryData } from "@supabase/supabase-js";
import Link from "next/link";
import { redirect } from "next/navigation";
import { parse } from "valibot";
import { getTripPlacePredictions } from "@/app/actions";
import { Map } from "@/components/map";
import RouteList from "@/components/route/route-list";
import { createClient } from "@/utils/supabase/server";
import { Location } from "@/utils/valibot/place-details";
import { PlacePredictionSchema } from "@/utils/valibot/places-auto-complete-schema";
import { getCoordinates, getRoutePolyLines } from "./actions";
import classes from "./trips.module.css";

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

  if (trip == null) {
    return <div>Invalid trip id</div>;
  }

  const placePredictions = await getTripPlacePredictions(id);
  const places = placePredictions.map((placePrediction) =>
    parse(PlacePredictionSchema, placePrediction.place),
  );

  // ----

  const coordinates = await getCoordinates(
    places.map((place) => place.placeId),
  );

  // ----

  const routes: [Location, Location][] = [];
  for (let i = 1; i < coordinates.length; i++) {
    routes.push([coordinates[i - 1], coordinates[i]]);
  }

  const routePolyLines = await getRoutePolyLines(routes);

  return (
    <div className="mt-2 space-y-4">
      <div className="">
        <Link
          href={`/trips/${id}/details`}
          className="flex items-center rounded-md border px-1 py-1.5"
        >
          <p>
            People: <span>{data.profile.length}</span> Cars: 1
          </p>
        </Link>
      </div>

      <section className={classes.mapContainer}>
        <Map
          placePredictions={placePredictions}
          coordinates={coordinates}
          routePolyLines={routePolyLines}
        />
      </section>

      <section className="space-y-2">
        <div className="flex justify-between gap-2">
          <Link
            className="flex grow items-center justify-center rounded-lg bg-blue-100 px-4 py-2 text-center text-sm font-extrabold text-blue-500 outline-2 outline-blue-200"
            href={`/trips/${id}/routes/new`}
          >
            <p className="block">Add Route</p>
          </Link>
          <Link
            className="flex grow items-center justify-center rounded-lg bg-green-100 px-4 py-2 text-center text-sm font-extrabold text-green-500 outline-2 outline-green-200"
            href={`/trips/${id}/report`}
          >
            <p className="block">View Report</p>
          </Link>
        </div>
        <RouteList routes={placePredictions} tripId={tripId} />
      </section>
    </div>
  );
}
