import Link from "next/link";

import { getTrip, getTripRoutes } from "@/app/actions";
import RouteCard from "@/components/route-card/route-card";

import classes from "./trips.module.css";

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const trip = await getTrip(id);
  const tripRoutes = await getTripRoutes(id);
  console.log(tripRoutes);

  if (trip == null) {
    return <div>Invalid trip id</div>;
  }

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

        {tripRoutes.map((route) => (
          <RouteCard key={route.id} start={route.start} end={route.end} />
        ))}

        <Link href={`/trips/${id}/routes/new`}>Add</Link>
      </section>
    </div>
  );
}
