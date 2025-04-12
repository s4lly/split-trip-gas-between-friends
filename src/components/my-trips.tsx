import TripLinks from "@/components/trip-links";
import { getMyTrips } from "@/features/trip/actions/get-my-trips";

export default async function MyTrips() {
  const trips = await getMyTrips();

  return (
    <div className="space-y-2">
      <h2 className="text-xl">My Trips</h2>
      <TripLinks trips={trips} />
    </div>
  );
}
