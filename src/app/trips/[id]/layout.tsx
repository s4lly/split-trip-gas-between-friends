import { QueryData } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import TripsBreadCrumb from "@/components/TripsBreadCrumb";
import { createClient } from "@/utils/supabase/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const tripId = parseInt(id, 10);
  if (isNaN(tripId)) {
    console.log("tripId is not a number: ", id);
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
    .eq("id", tripId)
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
      <div className="px-4">
        <TripsBreadCrumb />
      </div>
      <div className="p-4">{children}</div>
    </>
  );
}
