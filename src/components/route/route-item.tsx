"use client";

import { DotsSixVertical } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { FC } from "react";
import { TripNode } from "@/features/trip/types";

type RouteCardProps = {
  tripNode: TripNode;
};

const RouteItem: FC<RouteCardProps> = ({ tripNode }) => {
  return (
    <li className="flex cursor-pointer gap-2 border-gray-200 p-2 hover:bg-gray-100 hover:text-blue-700">
      <div className="flex shrink-0 items-center justify-center">
        <DotsSixVertical />
      </div>

      <Link
        className="grow-1"
        href={`/trips/${tripNode.destination.trip_id}/routes/${tripNode.destination.id}`}
      >
        {tripNode.destination.details.structuredFormat.mainText.text}
      </Link>
    </li>
  );
};

export default RouteItem;
