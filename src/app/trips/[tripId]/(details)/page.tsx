import { Car, Export, User } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Map } from "@/components/map";
import { Button } from "@/components/ui/button";
import { getTripGraph } from "@/features/trip/actions/get-trip-graph";
import { getTripWithUsers } from "@/features/trip/actions/get-trip-with-users";
import DestinationList from "@/features/trip/components/destination/destination-list";
import { newDestinationPath, overviewPath, planPath, sharePath } from "@/paths";

export default async function TripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  // TODO use use library
  const { tripId } = await params;

  const tripWithUsers = await getTripWithUsers(tripId);
  const tripGraph = await getTripGraph(tripId);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-2">
        <Button className="grow" variant="outline" asChild>
          <Link href={overviewPath(tripId)}>
            <div className="flex items-center gap-2">
              Overview:{" "}
              <div className="flex items-center">
                <User />
                {tripWithUsers.users.length}
              </div>
              <div className="flex items-center">
                <Car size={64} />2
              </div>
            </div>
          </Link>
        </Button>
        <Button variant="outline" size="icon">
          <Link href={sharePath(tripId)}>
            <Export />
          </Link>
        </Button>
      </div>

      <div className="-mx-4 h-[200px]">
        <Map mapGraph={tripGraph} />
      </div>

      <section className="space-y-2">
        <div className="flex justify-between gap-2">
          <Button className="grow" asChild>
            <Link href={newDestinationPath(tripId)}>
              <p className="block">Add Destination</p>
            </Link>
          </Button>
          <Button className="grow" asChild>
            <Link href={planPath(tripId)}>
              <p className="block">View Plan</p>
            </Link>
          </Button>
        </div>
        <DestinationList mapGraph={tripGraph} />
      </section>
    </div>
  );
}
