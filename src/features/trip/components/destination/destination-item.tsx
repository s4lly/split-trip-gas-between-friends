"use client";

import Link from "next/link";
import { FC } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { updateDestination } from "@/features/trip/actions/update-destination";
import { TripNode } from "@/features/trip/types";
import { destinationPath } from "@/paths";

type RouteCardProps = {
  tripNode: TripNode;
};

const DestinationItem: FC<RouteCardProps> = ({ tripNode }) => {
  return (
    <AccordionItem value={`${tripNode.destination.id}`}>
      <div className="flex items-center gap-2 px-2">
        <Link
          className="grow py-4"
          href={destinationPath(
            tripNode.destination.trip_id,
            tripNode.destination.id,
          )}
        >
          {tripNode.destination.details.structuredFormat.mainText.text}
        </Link>
        <AccordionTrigger className="size-[36px] items-center justify-center border" />
      </div>
      <AccordionContent className="p-2">
        <Button
          onClick={() =>
            updateDestination(
              tripNode.destination.trip_id,
              tripNode.destination.id,
              { is_deleted: true },
            )
          }
          className="w-full"
          variant="destructive"
        >
          Delete
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DestinationItem;
