import { redirect } from "next/navigation";
import { parse, ValiError } from "valibot";
import { RoutePolyLine, TripGraph, TripNode } from "@/features/trip/types";
import { Route } from "@/lib/types";
import { ComputedRoute } from "@/utils/valibot/compute-route-schema";
import {
  PlacePrediction,
  PlacePredictionSchema,
} from "@/utils/valibot/places-auto-complete-schema";

export const TripGraphNodes = (tripGraph: TripGraph): Iterable<TripNode> => {
  return {
    [Symbol.iterator]() {
      let cNode = tripGraph.start;

      return {
        next(): IteratorResult<TripNode> {
          if (cNode) {
            const value = cNode;
            cNode = cNode.next;

            return { done: false, value };
          } else {
            return { done: true, value: undefined };
          }
        },
      };
    },
  };
};

export const parsePlaceFromTripDestination = (
  tripDestination: Route,
): PlacePrediction => {
  try {
    return parse(PlacePredictionSchema, tripDestination.place);
  } catch (error) {
    if (error instanceof ValiError) {
      console.error(
        "Validation error while parsing place from trip route:",
        error,
        "Trip route data:",
        tripDestination,
      );
    } else {
      console.error(
        "Unexpected error while parsing place from trip route:",
        error,
        "Trip route data:",
        tripDestination,
      );
    }

    // TODO consider throwing and redirecting in an explicit server action
    redirect("/error");
  }
};

export const parsePlacesFromTripRoutes = (
  tripRoutes: Route[],
): PlacePrediction[] => {
  const places: PlacePrediction[] = [];

  for (const tripRoute of tripRoutes) {
    const place = parsePlaceFromTripDestination(tripRoute);

    if (!place) {
      continue;
    }

    places.push(place);
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

/**
 * Converts distance from meters to miles.
 *
 * @param meters the distance in meters
 * @returns the distance in miles rounded to 2 decimal places
 */
export const convertMetersToMiles = (meters: number): number => {
  if (isNaN(meters) || meters < 0) {
    throw new Error("Invalid distance in meters");
  }

  const miles = meters * 0.000621371;
  return parseFloat(miles.toFixed(2));
};

/**
 * convert duration from seconds to hours and minutes
 *
 * @param seconds the duration in seconds written as a string with the character 's' at the end
 * @returns the duration in hours and minutes
 */
export const convertSecondsToHoursAndMinutes = (
  seconds: string,
): { hours: number; minutes: number } => {
  const numericSeconds = parseInt(seconds.replace("s", ""), 10);
  if (isNaN(numericSeconds) || numericSeconds < 0) {
    throw new Error("Invalid duration in seconds");
  }

  const hours = Math.floor(numericSeconds / 3600);
  const minutes = Math.floor((numericSeconds % 3600) / 60);

  return { hours, minutes };
};

/**
 * given an object with hours and minutes format into a string
 *
 * @param time an object containing hours and minutes
 * @returns a string representation of the time in "HH:MM" format
 */
export const formatTime = ({
  hours,
  minutes,
}: {
  hours: number;
  minutes: number;
}): string => {
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
};
