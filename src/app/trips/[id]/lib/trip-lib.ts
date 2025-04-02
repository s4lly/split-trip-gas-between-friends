import { parse, ValiError } from "valibot";
import { Route } from "@/lib/types";
import { ComputedRoute } from "@/utils/valibot/compute-route-schema";
import {
  PlacePrediction,
  PlacePredictionSchema,
} from "@/utils/valibot/places-auto-complete-schema";
import { RoutePolyLine } from "../actions";

export const parsePlacesFromTripRoutes = (
  tripRoutes: Route[],
): PlacePrediction[] => {
  const places: PlacePrediction[] = [];

  for (const tripRoute of tripRoutes) {
    try {
      const place = parse(PlacePredictionSchema, tripRoute.place);
      places.push(place);
    } catch (error) {
      if (error instanceof ValiError) {
        console.error(
          "Validation error while parsing place from trip route:",
          error,
          "Trip route data:",
          tripRoute,
        );
      } else {
        console.error(
          "Unexpected error while parsing place from trip route:",
          error,
          "Trip route data:",
          tripRoute,
        );
      }
    }
  }

  return places;
};

export type DestinationDetail = {
  place: PlacePrediction;
  coordinate: { lat: number; lng: number };
  route: ComputedRoute;
};

export const getDestinationDetails = (
  routePolyLines: RoutePolyLine[],
  placeIdToPlaceMap: Map<string, PlacePrediction>,
  placeIdToCoordinatesMap: Map<string, { lat: number; lng: number }>,
): DestinationDetail[] => {
  const routeDetails: DestinationDetail[] = [];

  for (const routePolyLine of routePolyLines) {
    const place = placeIdToPlaceMap.get(routePolyLine.origin.placeId);
    const coordinate = placeIdToCoordinatesMap.get(
      routePolyLine.origin.placeId,
    );

    if (!place || !coordinate) {
      continue;
    }

    routeDetails.push({
      place,
      coordinate,
      route: routePolyLine.route,
    });
  }

  // need to add details from destination of last
  const {
    destination: { placeId },
    route,
  } = routePolyLines[routePolyLines.length - 1];

  const place = placeIdToPlaceMap.get(placeId);
  const coordinate = placeIdToCoordinatesMap.get(placeId);

  if (place && coordinate && route) {
    routeDetails.push({
      place,
      coordinate,
      route,
    });
  }

  return routeDetails;
};
