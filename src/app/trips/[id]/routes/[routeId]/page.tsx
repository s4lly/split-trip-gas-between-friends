import { QueryData } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { parse } from "valibot";
import TripSubPageHeader from "@/components/TripSubPageHeader";
import UpdateVehicleForm from "@/components/udpate-vehicle-form/update-vehicle-form";
import UpdateDriverForm from "@/components/update-driver-form/update-driver-form";
import { createClient } from "@/utils/supabase/server";
import { PlacePredictionSchema } from "@/utils/valibot/places-auto-complete-schema";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ routeId: string; id: string }>;
}) {
  const { routeId, id } = await params;

  const routeIdNum = parseInt(routeId, 10);
  if (isNaN(routeIdNum)) {
    console.log("routeId param is not a number: ", routeId);
    redirect("/error");
  }

  const supabase = await createClient();

  const { data: route, error } = await supabase
    .from("route")
    .select("*")
    .eq("id", routeIdNum)
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
    .eq("id", parseInt(id, 10))
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
      <TripSubPageHeader tripId={id} title="Route Details" />
      <div>
        <p>
          <strong>Destination:</strong> {place.structuredFormat.mainText.text}
        </p>
      </div>
      <div>
        <UpdateDriverForm
          tripId={routeIdNum}
          routeId={routeIdNum}
          selectedId={route.driver_id ?? ""}
          profiles={tripProfiles.profile}
        />
      </div>
      <div>
        <UpdateVehicleForm
          tripId={routeIdNum}
          routeId={routeIdNum}
          selectedId={route.vehicle_id}
          vehicles={vehicles}
        />
      </div>
    </div>
  );
}
