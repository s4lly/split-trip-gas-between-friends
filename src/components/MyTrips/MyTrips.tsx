import { use } from "react";
import Link from "next/link";

import classes from "@/app/page.module.css";

import { Database } from "@/utils/supabase/database.types";
type Trip = Database["public"]["Tables"]["trip"]["Row"];

export default function MyTrips({ trips }: { trips: Promise<Trip[]> }) {
  const allTrips = use(trips);

  return (
    <div>
      <div className={classes.tripsHeader}>
        <h2>My Trips</h2>
        <Link href="/trips/new">new</Link>
      </div>

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
    </div>
  );
}
