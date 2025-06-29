import { redirect } from "next/navigation";
import { parse, ValiError } from "valibot";
import { GraphNode, MapGraph } from "@/features/trip/types";
import { Route } from "@/lib/types";
import {
  PlacePrediction,
  PlacePredictionSchema,
} from "@/utils/valibot/places-auto-complete-schema";

/**
 * Finds the node in the MapGraph with type 'suggestion' and matching placeId.
 * @param graph The MapGraph to search.
 * @param placeId The placeId to match.
 * @returns The matching GraphNode of type 'suggestion', or null if not found.
 */
export const findSelectedSuggestionNode = (
  graph: MapGraph | null,
  placeId: string | undefined,
): Extract<GraphNode, { type: "suggestion" }> | null => {
  if (!graph?.start || !placeId) return null;

  let current: GraphNode | null = graph.start;
  while (current) {
    if (
      current.type === "suggestion" &&
      current.placeSuggestion.placeId === placeId
    ) {
      return current as Extract<GraphNode, { type: "suggestion" }>;
    }
    current = current.next;
  }
  return null;
};

/**
 * Returns an iterable for traversing all GraphNode objects in a MapGraph, following the `next` property.
 *
 * If a `selected` placeId is provided, only the node matching that placeId is yielded. The match is performed as follows:
 *   - For nodes with type 'suggestion', the node is yielded if node.placeSuggestion.placeId === selected
 *   - For nodes with type 'trip', the node is yielded if either:
 *       - node.destination.details?.placeId === selected
 *       - node.destination.place?.placeId === selected
 *
 * @param mapGraph - The MapGraph to traverse.
 * @param selected - (Optional) The placeId to select a specific node.
 * @returns An iterable of GraphNode objects in the MapGraph.
 */
export const mapGraphNodeIterator = (
  mapGraph: MapGraph,
  selected?: string,
): Iterable<GraphNode> => {
  return {
    [Symbol.iterator]() {
      let cNode = mapGraph.start;

      return {
        next(): IteratorResult<GraphNode> {
          if (selected) {
            while (cNode) {
              if (
                (cNode.type === "suggestion" &&
                  cNode.placeSuggestion.placeId === selected) ||
                (cNode.type === "trip" &&
                  ((cNode.destination.details &&
                    typeof cNode.destination.details === "object" &&
                    "placeId" in cNode.destination.details &&
                    cNode.destination.details.placeId === selected) ||
                    (cNode.destination.place &&
                      typeof cNode.destination.place === "object" &&
                      "placeId" in cNode.destination.place &&
                      cNode.destination.place.placeId === selected)))
              ) {
                const res = { done: false, value: cNode };
                cNode = null;
                return res;
              }
              cNode = cNode.next;
            }
          }

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
