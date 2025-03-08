import { use } from "react";
import Link from "next/link";

import { Database } from "@/utils/supabase/database.types";
type Trip = Database["public"]["Tables"]["trip"]["Row"];

export default function MyTrips({ trips }: { trips: Promise<Trip[]> }) {
  const allTrips = use(trips);

  return (
    <div>
      {allTrips.length > 0 && (
        <ul>
          {allTrips.map((trip) => (
            <li key={trip.id}>
              <Link href={`/trips/${trip.id}`}>{trip.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
