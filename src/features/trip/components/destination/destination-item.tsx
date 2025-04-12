"use client";

import Link from "next/link";
import { FC } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TripNode } from "@/features/trip/types";
import { destinationPath } from "@/paths";

type RouteCardProps = {
  tripNode: TripNode;
};

const DestinationItem: FC<RouteCardProps> = ({ tripNode }) => {
  return (
    <AccordionItem value={`${tripNode.destination.id}`}>
      <div className="flex items-center gap-2">
        <div className="grow">
          <Link
            className="inline-block size-full py-4"
            href={destinationPath(
              tripNode.destination.trip_id,
              tripNode.destination.id,
            )}
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

export default DestinationItem;
