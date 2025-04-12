import Link from "next/link";
import { Trip } from "@/lib/types";

interface TripLinksProps {
  trips: Trip[];
}

export default function TripLinks({ trips }: TripLinksProps) {
  return (
    <>
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
    </>
  );
}
