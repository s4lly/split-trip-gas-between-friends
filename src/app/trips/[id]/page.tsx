import Link from "next/link";
import { getTripRoutes } from "@/app/actions";
import { Map } from "@/components/map";
import RouteList from "@/components/route/route-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getPlaceCoordinates,
  getRoutePolyLines,
  getTripProfiles,
} from "./actions";
import { parsePlacesFromTripRoutes } from "./lib/trip-lib";

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
  const places = parsePlacesFromTripRoutes(tripRoutes);
  const placeCoordinates = await getPlaceCoordinates(places);
  const routePolyLines = await getRoutePolyLines(placeCoordinates);

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

      <Card className="w-full">
        <CardContent className="flex h-[200px] items-center justify-center">
          <Map
            placeCoordinates={placeCoordinates}
            routePolyLines={routePolyLines}
          />
        </CardContent>
      </Card>

      <section className="space-y-2">
        <div className="flex justify-between gap-2">
          <Button className="grow" asChild>
            <Link href={`/trips/${id}/routes/new`}>
              <p className="block">Add Route</p>
            </Link>
          </Button>
          <Button className="grow" asChild>
            <Link href={`/trips/${id}/report`}>
              <p className="block">View Plan</p>
            </Link>
          </Button>
        </div>
        <RouteList tripRoutes={tripRoutes} tripId={tripId} />
      </section>
    </div>
  );
}
