import { Plus } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { getTrips } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { tripNewPath } from "@/paths";
import { createClient } from "@/utils/supabase/server";

export default async function MyTrips() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth?.user) {
    return null;
  }

  const trips = await getTrips();

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h2 className="text-2xl">My Trips</h2>
        <Button className="w-full" asChild>
          <Link href={tripNewPath()}>
            <Plus />
            <p>New</p>
          </Link>
        </Button>
      </div>
      <div>
        {trips.length > 0 && (
          <ul className="divide-y rounded-b-lg border border-gray-200 bg-white text-sm font-medium text-gray-900">
            {trips.map((trip) => (
              <Link
                className="block w-full cursor-pointer border-gray-200 px-4 py-2 hover:bg-gray-100 hover:text-blue-700"
                key={trip.id}
                href={`/trips/${trip.id}`}
              >
                <li>{trip.name}</li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
