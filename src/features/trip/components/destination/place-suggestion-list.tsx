import { MapGraph } from "@/features/trip/types";
import { MapGraphNodes } from "@/features/trip/utils";
import { PlacePrediction } from "@/utils/valibot/places-auto-complete-schema";

export const PlaceSuggestionList = ({
  handleClickSuggestion,
  placeSuggestionsGraph,
}: {
  handleClickSuggestion: (placePrediction: PlacePrediction) => void;
  placeSuggestionsGraph: MapGraph | null;
}) => {
  if (!placeSuggestionsGraph || placeSuggestionsGraph.size === 0) return null;

  const suggestionNodes = Array.from(
    MapGraphNodes(placeSuggestionsGraph),
  ).filter((node) => node.type === "suggestion");

  if (suggestionNodes.length === 0) return null;

  return (
    <ul>
      {suggestionNodes.map((node) => (
        <li key={node.placeSuggestion.placeId}>
          <button
            className="block w-full px-1 py-2 text-left"
            onClick={() => handleClickSuggestion(node.placeSuggestion)}
          >
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-200 p-2">
                {node.label}
              </div>
              <div className="flex flex-col">
                <p className="font-medium">
                  {node.placeSuggestion.structuredFormat.mainText.text}
                </p>
                <p className="text-sm font-light">
                  {node.placeSuggestion.structuredFormat.secondaryText.text}
                </p>
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};
