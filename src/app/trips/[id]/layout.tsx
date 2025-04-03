import { QueryData } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import LayoutDrawer from "@/components/layout-drawer";
import TripsBreadCrumb from "@/components/TripsBreadCrumb";
import { Separator } from "@/components/ui/separator";
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
    <div>
      <div className="bg-gray-100">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-extrabold">{trip.name}</h1>
          </div>
          <LayoutDrawer />
        </div>
        <div className="px-4">
          <TripsBreadCrumb />
        </div>
      </div>
      <Separator />
      <div className="p-4">{children}</div>
    </div>
  );
}
