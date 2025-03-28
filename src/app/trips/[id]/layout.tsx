import LayoutDrawer from "@/components/layout-drawer";
import { createClient } from "@/utils/supabase/server";
import { QueryData } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

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
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h1 className="text-2xl font-extrabold">{trip.name}</h1>
        </div>
        <LayoutDrawer />
      </div>
      {children}
    </div>
  );
}
