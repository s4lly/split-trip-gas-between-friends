import { getTripRoutes } from "@/app/actions";
import StaticMap from "@/components/static-map";
import { PlacePrediction } from "@/utils/valibot/places-auto-complete-schema";
import { getPlaceCoordinates, getRoutePolyLines } from "../actions";
import {
  getDestinationDetails,
  parsePlacesFromTripRoutes,
} from "../lib/trip-lib";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tripRoutes = await getTripRoutes(id);
  const places = parsePlacesFromTripRoutes(tripRoutes);
  const placeCoordinates = await getPlaceCoordinates(places);
  const routePolyLines = await getRoutePolyLines(placeCoordinates);

  const placeIdToPlaceMap = new Map<string, PlacePrediction>(
    places.map((place) => [place.placeId, place]),
  );
  const placeIdToCoordinatesMap = new Map<string, { lat: number; lng: number }>(
    placeCoordinates.map((place) => [
      place.placeId,
      { lat: place.location.latitude, lng: place.location.longitude },
    ]),
  );

  const destinationDetails = getDestinationDetails(
    routePolyLines,
    placeIdToPlaceMap,
    placeIdToCoordinatesMap,
  );

  return (
    <section className="space-y-4">
      {destinationDetails.map(({ place, coordinate, route }, index) => {
        return (
          <div key={index}>
            <StaticMap coordinate={coordinate} />
            <div className="px-3 py-1">
              <p>place: {place.structuredFormat.mainText.text}</p>
              <p>Distance: {route.distanceMeters} m</p>
              <p>Duration: {route.duration} s</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
