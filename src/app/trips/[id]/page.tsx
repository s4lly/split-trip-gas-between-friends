import Link from "next/link";

import { getTrip } from "@/app/actions";
import RouteCard from "@/components/route-card/route-card";

import classes from "./trips.module.css";

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const trip = await getTrip(parseInt(id, 10));

  return (
    <div>
      <h1>{trip.name}</h1>

      <section className={classes.detailsContainer}>
        <section>
          <h2>people</h2>
        </section>
        <section className={classes.mapContainer}>
          <p>map</p>
        </section>
      </section>

      <section className={classes.routeContainer}>
        <h2>routes</h2>

        <RouteCard start={"location a"} end={"location b"} />
        <RouteCard start={"location b"} end={"location c"} />

        <Link href={`/trips/${id}/routes/new`}>Add</Link>
      </section>
    </div>
  );
}
