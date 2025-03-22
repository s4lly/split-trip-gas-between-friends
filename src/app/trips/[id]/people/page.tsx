import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { QueryData } from "@supabase/supabase-js";

export default async function PeoplePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

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
        `
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

  if (!trip || !trip.profile) {
    return <div>No profiles found for this trip</div>;
  }

  return (
    <div className="space-y-4 mt-2">
      <h1 className="text-lg font-bold">People in this trip</h1>
      <ul className="list-disc pl-5">
        {trip.profile.map((person) => (
          <li key={person.id}>{person.email}</li>
        ))}
      </ul>
    </div>
  );
}
