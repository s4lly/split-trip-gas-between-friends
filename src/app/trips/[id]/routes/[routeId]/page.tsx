import { createClient } from "@/utils/supabase/server";
import { PlacePredictionSchema } from "@/utils/valibot/places-auto-complete-schema";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { redirect } from "next/navigation";
import { parse } from "valibot";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  // ----

  const supabase = await createClient();

  // ----

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

  // ----

  const { data: foo, error: fooError } = await supabase.from("profile").select(`
    *,
    trip (
      owner_id
  )
  `);

  if (fooError) {
    console.log(fooError);
    redirect("/error");
  }

  console.log(foo);

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
    <div>
      <div className="flex items-center gap-2">
        <Link href={`/trips/${id}`}>
          <ArrowLeft className="size-6 text-gray-500" />
        </Link>
        <h1>Route Details</h1>
      </div>
      <p>
        <strong>ID:</strong> {route.id}
      </p>
      <p>
        <strong>Destination:</strong> {place.structuredFormat.mainText.text}
      </p>
      <p>{route.driver_id == null ? "no driver" : "driver"}</p>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Driver" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Drivers</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
