import { FC } from "react";
import { Accordion } from "@/components/ui/accordion";
import DestinationItem from "@/features/trip/components/destination/destination-item";
import { MapGraph } from "@/features/trip/types";
import { MapGraphNodes } from "@/features/trip/utils";

type DestinationListProps = {
  mapGraph: MapGraph;
};

const DestinationList: FC<DestinationListProps> = ({ mapGraph }) => {
  const tripNodes = Array.from(MapGraphNodes(mapGraph));

  return (
    <>
      {tripNodes.length > 0 && (
        <Accordion type="single" collapsible className="rounded-md border">
          {tripNodes.map((tripNode) => {
            if (tripNode.type === "suggestion") {
              return null;
            }

            return (
              <DestinationItem
                key={tripNode.destination.id}
                tripNode={tripNode}
              />
            );
          })}
        </Accordion>
      )}
    </>
  );
};

export default DestinationList;
