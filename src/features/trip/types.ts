import { getTripDestinations } from "@/features/trip/actions/get-trip-destinations";
import { First } from "@/utils/types";
import { ComputedRoute } from "@/utils/valibot/compute-route-schema";
import { Location } from "@/utils/valibot/place-details-schema";
import { PlacePrediction } from "@/utils/valibot/places-auto-complete-schema";

export type MapGraph = {
  size: number;
  start: GraphNode | null;
  end: GraphNode | null;
};

export type GraphNode = {
  previous: GraphNode | null;
  next: GraphNode | null;
  coordinates: Location;
} & (TripNode | SuggestionsNode);

export type TripNode = {
  type: "trip";

  route: RouteNode | null;
  destination: TripDestination;
};

export type SuggestionsNode = {
  type: "suggestion";
  label: string;

  placeSuggestion: PlacePrediction;
};

export type RouteNode = {
  start: GraphNode;
  finish: GraphNode;
} & ComputedRoute;

// ----

export type RoutePolyLine = {
  origin: {
    placeId: string;
  };
  destination: {
    placeId: string;
  };
  route: ComputedRoute;
};

// ----

export type TripDestinations = Awaited<ReturnType<typeof getTripDestinations>>;
export type TripDestination = First<TripDestinations>;
