import { Suspense } from "react";
import TripLinks from "@/components/trip-links";
import { getMySharedTrips } from "@/features/trip/actions/get-my-shared-trips";

export default async function MySharedTrips() {
  const mySharedTripsPromise = getMySharedTrips();

  return (
    <div className="space-y-2">
      <h2 className="text-xl">Shared Trips</h2>
      <Suspense fallback={<p>loading...</p>}>
        <TripLinks tripsPromise={mySharedTripsPromise} />
      </Suspense>
    </div>
  );
}
