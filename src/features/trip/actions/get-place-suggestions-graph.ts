import { GraphNode, MapGraph } from "@/features/trip/types";
import { PlaceSuggestions } from "@/utils/valibot/places-auto-complete-schema";
import { getPlaceCoordinates } from "./get-place-coordinates";

export const getPlaceSuggestionsGraph = async (
  placeSuggestions: PlaceSuggestions | undefined,
): Promise<MapGraph> => {
  const placeSuggestionGraph: MapGraph = {
    size: 0,
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
      label: String.fromCharCode("A".charCodeAt(0) + i),
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
    placeSuggestionGraph.size += 1;
    pNode = cNode;
  }

  return placeSuggestionGraph;
};
