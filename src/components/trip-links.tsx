import Link from "next/link";
import { use } from "react";
import { Trip } from "@/lib/types";

interface TripLinksProps {
  tripsPromise: Promise<Trip[]>;
}

export default function TripLinks({ tripsPromise }: TripLinksProps) {
  const trips = use(tripsPromise);

  return (
    <>
      {trips.length > 0 && (
        <ul className="divide-y rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900">
          {trips.map((trip) => (
            <Link
              className="block w-full cursor-pointer border-gray-200 p-4 hover:bg-gray-100 hover:text-blue-700"
              key={trip.id}
              href={`/trips/${trip.id}`}
            >
              <li>{trip.name}</li>
            </Link>
          ))}
        </ul>
      )}
    </>
  );
}
