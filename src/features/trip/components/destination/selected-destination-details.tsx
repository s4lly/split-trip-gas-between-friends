import { MapGraph } from "@/features/trip/types";

export const SelectedDestinationDetails = ({
  destinationGraph,
}: {
  destinationGraph: MapGraph | null;
}) => {
  if (!destinationGraph || destinationGraph.start !== destinationGraph.end) {
    return null;
  }

  return <p>todo</p>;
};
