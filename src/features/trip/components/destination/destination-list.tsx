import { FC } from "react";
import { Accordion } from "@/components/ui/accordion";
import DestinationItem from "@/features/trip/components/destination/destination-item";
import { TripGraph } from "@/features/trip/types";
import { TripGraphNodes } from "@/features/trip/utils";

type DestinationListProps = {
  tripGraph: TripGraph;
};

const DestinationList: FC<DestinationListProps> = ({ tripGraph }) => {
  const tripNodes = Array.from(TripGraphNodes(tripGraph));

  return (
    <>
      {tripNodes.length > 0 && (
        <Accordion type="single" collapsible className="rounded-md border">
          {tripNodes.map((tripNode) => (
            <DestinationItem
              key={tripNode.destination.id}
              tripNode={tripNode}
            />
          ))}
        </Accordion>
      )}
    </>
  );
};

export default DestinationList;
