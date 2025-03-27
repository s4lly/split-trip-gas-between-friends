import { createClient } from "@/utils/supabase/server";
import { PlacePredictionSchema } from "@/utils/valibot/places-auto-complete-schema";
import { redirect } from "next/navigation";
import { parse } from "valibot";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ routeId: string }>;
}) {
  const { routeId } = await params;

  const routeIdNum = parseInt(routeId, 10);
  if (isNaN(routeIdNum)) {
    console.log("routeId param is not a number: ", routeId);
    redirect("/error");
  }

  const supabase = await createClient();

  // Fetch route data from Supabase
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

  const place = parse(PlacePredictionSchema, route.place);

  return (
    <div>
      <h1>Route Details</h1>
      <p>
        <strong>ID:</strong> {route.id}
      </p>
      <p>
        <strong>Name:</strong> {place.structuredFormat.mainText.text}
      </p>
      {/* Add more fields as necessary */}
    </div>
  );
}
