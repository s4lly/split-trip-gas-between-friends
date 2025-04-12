import { QueryData } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function DetailsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const tripIdNum = parseInt(tripId, 10);
  if (isNaN(tripIdNum)) {
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
        `,
    )
    .eq("id", tripIdNum)
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
    <div className="mt-2 space-y-4">
      <ul className="list-disc pl-5">
        {trip.profile.map((person) => (
          <li key={person.id}>{person.email}</li>
        ))}
      </ul>
    </div>
  );
}
