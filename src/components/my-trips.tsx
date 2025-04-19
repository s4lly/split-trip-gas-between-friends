import { Suspense } from "react";
import TripLinks from "@/components/trip-links";
import { getMyTrips } from "@/features/trip/actions/get-my-trips";

export default async function MyTrips() {
  const myTripsPromise = getMyTrips();

  return (
    <div className="space-y-2">
      <h2 className="text-xl">My Trips</h2>
      <Suspense fallback={<p>loading...</p>}>
        <TripLinks tripsPromise={myTripsPromise} />
      </Suspense>
    </div>
  );
}
