"use client";

import React, { FC } from "react";
import RouteItem from "@/components/route/route-item";
import { TripGraph } from "@/features/trip/types";
import { TripGraphNodes } from "@/features/trip/utils";

type RouteListProps = {
  tripGraph: TripGraph;
};

const RouteList: FC<RouteListProps> = ({ tripGraph }) => {
  const tripNodes = Array.from(TripGraphNodes(tripGraph));

  return (
    <>
      {tripNodes.length > 0 && (
        <ul className="divide-y rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-900">
          {tripNodes.map((tripNode) => (
            <RouteItem key={tripNode.destination.id} tripNode={tripNode} />
          ))}
        </ul>
      )}
    </>
  );
};

export default RouteList;
