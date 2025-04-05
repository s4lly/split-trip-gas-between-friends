import { getTripDestinations } from "@/features/trip/actions/get-trip-destinations";
import { First } from "@/utils/types";
import { ComputedRoute } from "@/utils/valibot/compute-route-schema";
import { Location } from "@/utils/valibot/place-details-schema";

export type RouteNode = {
  start: TripNode;
  finish: TripNode;
} & ComputedRoute;

export type TripNode = {
  previous: TripNode | null;
  next: TripNode | null;

  route: RouteNode | null;

  destination: TripDestination;
  coordinates: Location;
};

export type TripGraph = {
  start: TripNode | null;
  end: TripNode | null;
};

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
