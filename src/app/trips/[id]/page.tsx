import Link from "next/link";
import { getTripRoutes } from "@/app/actions";
import { Map } from "@/components/map";
import RouteList from "@/components/route/route-list";
import { getCoordinates, getRoutePolyLines, getTripProfiles } from "./actions";
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

  const tripProfiles = await getTripProfiles(tripId);
  const tripRoutes = await getTripRoutes(id);
  const coordinates = await getCoordinates(tripRoutes);
  const routePolyLines = await getRoutePolyLines(coordinates);

  return (
    <div className="mt-2 space-y-4">
      <div className="">
        <Link
          href={`/trips/${id}/details`}
          className="flex items-center rounded-md border px-1 py-1.5"
        >
          <p>
            People: <span>{tripProfiles.profile.length}</span> Cars: 1
          </p>
        </Link>
      </div>

      <section className={classes.mapContainer}>
        <Map coordinates={coordinates} routePolyLines={routePolyLines} />
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
        <RouteList tripRoutes={tripRoutes} tripId={tripId} />
      </section>
    </div>
  );
}
