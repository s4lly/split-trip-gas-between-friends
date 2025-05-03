import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CreateTripForm } from "@/features/trips/components/create-trip-form";

export default function TripsNew() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/">
          <ArrowLeft className="size-6 text-gray-500" />
        </Link>
        <h2 className="text-2xl font-extrabold">Trips / new</h2>
      </div>

      <CreateTripForm />
    </div>
  );
}
