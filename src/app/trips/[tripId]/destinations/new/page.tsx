import { getTripWithUsers } from "@/features/trip/actions/get-trip-with-users";
import { getUsersVehicles } from "@/features/trip/actions/get-users-vehicles";
import { NewDestinationForm } from "@/features/trip/components/destination/new-destination-form";

export default async function NewDestinationPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const tripData = await getTripWithUsers(tripId);
  const vehiclesData = await getUsersVehicles(tripData.users);

  return <NewDestinationForm vehicles={vehiclesData} users={tripData.users} />;
}
