import TripLinks from "@/components/trip-links";
import { getMySharedTrips } from "@/features/trip/actions/get-my-shared-trips";

export default async function MySharedTrips() {
  const mySharedTrips = await getMySharedTrips();

  return (
    <div className="space-y-2">
      <h2 className="text-xl">Shared Trips</h2>
      <TripLinks trips={mySharedTrips} />
    </div>
  );
}
