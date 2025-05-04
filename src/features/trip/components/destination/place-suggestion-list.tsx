import {
  PlacePrediction,
  PlaceSuggestions,
} from "@/utils/valibot/places-auto-complete-schema";

export const PlaceSuggestionList = ({
  placeSuggestions,
  handleClickSuggestion,
}: {
  placeSuggestions: PlaceSuggestions | undefined;
  handleClickSuggestion: (placePrediction: PlacePrediction) => void;
}) => {
  return (
    <>
      {(placeSuggestions?.suggestions?.length ?? 0) > 0 && (
        <ul>
          {placeSuggestions?.suggestions.map((suggestion) => (
            <li key={suggestion.placePrediction.placeId}>
              <button
                key={suggestion.placePrediction.placeId}
                className="block w-full px-1 py-2 text-left"
                onClick={() =>
                  handleClickSuggestion(suggestion.placePrediction)
                }
              >
                <p className="font-medium">
                  {suggestion.placePrediction.structuredFormat.mainText.text}
                </p>
                <p className="text-sm font-light">
                  {
                    suggestion.placePrediction.structuredFormat.secondaryText
                      .text
                  }
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
