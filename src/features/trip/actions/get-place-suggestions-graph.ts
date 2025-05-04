import { GraphNode, MapGraph } from "@/features/trip/types";
import { PlaceSuggestions } from "@/utils/valibot/places-auto-complete-schema";
import { getPlaceCoordinates } from "./get-place-coordinates";

export const getPlaceSuggestionsGraph = async (
  placeSuggestions: PlaceSuggestions | undefined,
): Promise<MapGraph> => {
  const placeSuggestionGraph: MapGraph = {
    end: null,
    start: null,
  };

  if (!placeSuggestions || !placeSuggestions.suggestions.length) {
    return placeSuggestionGraph;
  }

  const { suggestions } = placeSuggestions;

  let pNode: GraphNode | null = null;
  for (let i = 0; i < suggestions.length; i++) {
    const placeSuggestion = suggestions[i];

    const cNode: GraphNode = {
      type: "suggestion",
      previous: pNode,
      next: null,
      coordinates: await getPlaceCoordinates(placeSuggestion.placePrediction),

      placeSuggestion: placeSuggestion.placePrediction,
    };

    if (i === 0) {
      placeSuggestionGraph.start = cNode;
    }

    if (pNode) {
      pNode.next = cNode;
    }

    placeSuggestionGraph.end = cNode;
    pNode = cNode;
  }

  return placeSuggestionGraph;
};
