import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getTrips } from "@/app/actions";

export default async function MyTrips() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth?.user) {
    return null;
  }

  const trips = await getTrips();

  return (
    <>
      <div>
        <h2 className="text-2xl mb-2">My Trips</h2>
        <Link href="/trips/new">new</Link>
      </div>
      <div>
        {trips.length > 0 && (
          <ul className="list-disc list-inside">
            {trips.map((trip) => (
              <li key={trip.id}>
                <Link href={`/trips/${trip.id}`}>{trip.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
