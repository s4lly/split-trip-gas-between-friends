import { getTripRoutes } from "@/app/actions";
import TripSubPageHeader from "@/components/TripSubPageHeader";
import { getCoordinates, getRoutePolyLines } from "../actions";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tripRoutes = await getTripRoutes(id);
  const coordinates = await getCoordinates(tripRoutes);
  const routePolyLines = await getRoutePolyLines(coordinates);

  return (
    <>
      <TripSubPageHeader tripId={id} title="Report" />

      <section>
        {routePolyLines.map(({ routes: [route] }, index) => (
          <div key={index}>
            <p>Distance: {route.distanceMeters} m</p>
            <p>Duration: {route.duration} s</p>
          </div>
        ))}
      </section>
    </>
  );
}
