import { QueryData } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { createClient } from "@/utils/supabase/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const supabase = await createClient();

  const tripIdNum = parseInt(tripId, 10);
  if (isNaN(tripIdNum)) {
    console.log("tripIdNum is not a number: ", tripId);
    redirect("/error");
  }

  const profilesWithinTripQuery = supabase
    .from("trip")
    .select(
      `
          *,
          profile (
            *
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

  return (
    <>
      <div className="bg-gray-100">
        <Header>{trip.name}</Header>
      </div>
      <div className="px-4 pt-2 pb-4">{children}</div>
    </>
  );
}
