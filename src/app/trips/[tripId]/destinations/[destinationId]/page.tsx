import { QueryData } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { parse } from "valibot";
import UpdateDriverForm from "@/components/update-driver-form";
import UpdateVehicleForm from "@/components/update-vehicle-form";
import { createClient } from "@/utils/supabase/server";
import { PlacePredictionSchema } from "@/utils/valibot/places-auto-complete-schema";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ destinationId: string; tripId: string }>;
}) {
  const { destinationId, tripId } = await params;

  const destinationIdNum = parseInt(destinationId, 10);
  if (isNaN(destinationIdNum)) {
    console.log("destinationId param is not a number: ", destinationId);
    redirect("/error");
  }

  const supabase = await createClient();

  const { data: route, error } = await supabase
    .from("route")
    .select("*")
    .eq("id", destinationIdNum)
    .single();

  if (error) {
    return <div>Error fetching route data: {error.message}</div>;
  }

  if (!route) {
    return <div>Route not found</div>;
  }

  const tripProfilesQuery = supabase
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
    .eq("id", parseInt(tripId, 10))
    .single();

  const { data: tripProfilesData, error: tripProfilesDataError } =
    await tripProfilesQuery;

  // TODO o11y
  if (tripProfilesDataError) {
    console.log(tripProfilesDataError);
    redirect("/error");
  }

  type TripProfilesQuery = QueryData<typeof tripProfilesQuery>;
  const tripProfiles: TripProfilesQuery = tripProfilesData;

  const vehiclesQuery = supabase
    .from("vehicle")
    .select("*")
    .in(
      "owner_id",
      tripProfiles.profile.map((profile) => profile.id),
    );

  const { data: vehiclesData, error: vehiclesError } = await vehiclesQuery;

  if (vehiclesError) {
    console.log(vehiclesError);
    redirect("/error");
  }

  type VehiclesQuery = QueryData<typeof vehiclesQuery>;
  const vehicles: VehiclesQuery = vehiclesData;

  /*

  i wanna have a list of people on this trip

  wanna have a list of all the cars from the people

  have route
  have trip id
  have route id

  show
  - assigned car
  - assigned driver

  */

  const place = parse(PlacePredictionSchema, route.place);

  return (
    <div className="space-y-2">
      <div>
        <p>
          <strong>Destination:</strong> {place.structuredFormat.mainText.text}
        </p>
      </div>
      <div>
        <UpdateDriverForm
          tripId={destinationIdNum}
          destinationId={destinationIdNum}
          selectedId={route.driver_id ?? ""}
          profiles={tripProfiles.profile}
        />
      </div>
      <div>
        <UpdateVehicleForm
          tripId={destinationIdNum}
          destinationId={destinationIdNum}
          selectedId={route.vehicle_id}
          vehicles={vehicles}
        />
      </div>
    </div>
  );
}
