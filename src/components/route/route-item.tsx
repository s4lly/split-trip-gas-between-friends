"use client";

import Link from "next/link";
import { FC } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TripNode } from "@/features/trip/types";

type RouteCardProps = {
  tripNode: TripNode;
};

const RouteItem: FC<RouteCardProps> = ({ tripNode }) => {
  return (
    <AccordionItem value={`${tripNode.destination.id}`}>
      <div className="flex items-center gap-2">
        <div className="grow">
          <Link
            className="inline-block size-full py-4"
            href={`/trips/${tripNode.destination.trip_id}/routes/${tripNode.destination.id}`}
          >
            {tripNode.destination.details.structuredFormat.mainText.text}
          </Link>
        </div>
        <AccordionTrigger className="w-10 justify-center" />
      </div>
      <AccordionContent>foo</AccordionContent>
    </AccordionItem>
  );
};

export default RouteItem;
