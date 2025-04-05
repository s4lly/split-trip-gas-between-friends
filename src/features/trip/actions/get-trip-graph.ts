"use server";

import { getPlaceCoordinates } from "@/features/trip/actions/get-place-coordinates";
import { getTripDestinations } from "@/features/trip/actions/get-trip-destinations";
import { RouteNode, TripGraph, TripNode } from "@/features/trip/types";
import { getComputedRoute } from "./get-computed-route";

export const getTripGraph = async (tripId: string): Promise<TripGraph> => {
  const tripDestinations = await getTripDestinations(tripId);

  const tripGraph: TripGraph = {
    start: null,
    end: null,
  };

  if (!tripDestinations.length) {
    return tripGraph;
  }

  let pNode: TripNode | null = null;
  for (let i = 0; i < tripDestinations.length; i++) {
    const tripDestination = tripDestinations[i];

    const cNode: TripNode = {
      previous: pNode,
      next: null,

      destination: tripDestination,
      coordinates: await getPlaceCoordinates(tripDestination.details),

      route: null,
    };

    if (i === 0) {
      tripGraph.start = cNode;
    }

    if (pNode) {
      const computedRoute = await getComputedRoute([
        pNode.coordinates,
        cNode.coordinates,
      ]);

      const routeNode: RouteNode = {
        start: pNode,
        finish: cNode,
        ...computedRoute,
      };

      pNode.next = cNode;
      pNode.route = routeNode;
    }

    // end

    tripGraph.end = cNode;
    pNode = cNode;
  }

  return tripGraph;
};
