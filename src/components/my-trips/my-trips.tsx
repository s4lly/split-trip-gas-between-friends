import { use } from "react";
import Link from "next/link";

import { Trip } from "@/lib/types";

export default function MyTrips({ trips }: { trips: Promise<Trip[]> }) {
  const allTrips = use(trips);

  return (
    <div>
      {allTrips.length > 0 && (
        <ul className="list-disc list-inside">
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
