"use client";

import React, { FC } from "react";
import { Route } from "@/lib/types";
import RouteItem from "./route-item";

type RouteListProps = {
  tripRoutes: Route[];
  tripId: number;
};

const RouteList: FC<RouteListProps> = ({ tripRoutes, tripId }) => {
  return (
    <>
      {tripRoutes.length > 0 && (
        <ul className="divide-y rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-900">
          {tripRoutes.map((route) => (
            <RouteItem key={route.id} route={route} tripId={tripId} />
          ))}
        </ul>
      )}
    </>
  );
};

export default RouteList;
