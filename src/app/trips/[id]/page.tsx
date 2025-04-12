import Link from "next/link";
import { Map } from "@/components/map";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTripGraph } from "@/features/trip/actions/get-trip-graph";
import { getTripWithUsers } from "@/features/trip/actions/get-trip-with-users";
import DestinationList from "@/features/trip/components/destination/destination-list";
import { newDestinationPath, planPath } from "@/paths";

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tripWithUsers = await getTripWithUsers(id);
  const tripGraph = await getTripGraph(id);

  return (
    <div className="mt-2 space-y-4">
      <div className="">
        <Link
          href={`/trips/${id}/details`}
          className="flex items-center rounded-md border px-1 py-1.5"
        >
          <p>
            People: <span>{tripWithUsers.users.length}</span> Cars: 1
          </p>
        </Link>
      </div>

      <Card className="w-full">
        <CardContent className="flex h-[200px] items-center justify-center">
          <Map tripGraph={tripGraph} />
        </CardContent>
      </Card>

      <section className="space-y-2">
        <div className="flex justify-between gap-2">
          <Button className="grow" asChild>
            <Link href={newDestinationPath(id)}>
              <p className="block">Add Destination</p>
            </Link>
          </Button>
          <Button className="grow" asChild>
            <Link href={planPath(id)}>
              <p className="block">View Plan</p>
            </Link>
          </Button>
        </div>
        <DestinationList tripGraph={tripGraph} />
      </section>
    </div>
  );
}
