import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getTrips } from "@/app/actions";
import { Plus } from "@phosphor-icons/react/dist/ssr";

export default async function MyTrips() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth?.user) {
    return null;
  }

  const trips = await getTrips();

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl">My Trips</h2>
        <Link
          className="flex items-center px-4 w-full text-white bg-green-400 hover:bg-green-500 font-medium rounded-t-lg text-sm p-2 text-center"
          href="/trips/new"
        >
          <Plus />
          <p>New</p>
        </Link>
      </div>
      <div>
        {trips.length > 0 && (
          <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 divide-y rounded-b-lg">
            {trips.map((trip) => (
              <Link
                className="block w-full px-4 py-2 border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700"
                key={trip.id}
                href={`/trips/${trip.id}`}
              >
                <li>{trip.name}</li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
