"use client";

import { Route } from "@/lib/types";
import React, { FC } from "react";
import RouteItem from "./route-item";

type RouteListProps = {
  routes: Route[];
  tripId: number;
};

const RouteList: FC<RouteListProps> = ({ routes, tripId }) => {
  return (
    <>
      {routes.length > 0 && (
        <ul className="divide-y rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-900">
          {routes.map((route) => (
            <RouteItem key={route.id} route={route} tripId={tripId} />
          ))}
        </ul>
      )}
    </>
  );
};

export default RouteList;
