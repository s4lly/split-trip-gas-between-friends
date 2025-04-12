"use client";

import { FC } from "react";
import RouteItem from "@/components/route/route-item";
import { Accordion } from "@/components/ui/accordion";
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
        <Accordion type="single" collapsible>
          {tripNodes.map((tripNode) => (
            <RouteItem key={tripNode.destination.id} tripNode={tripNode} />
          ))}
        </Accordion>
      )}
    </>
  );
};

export default RouteList;
