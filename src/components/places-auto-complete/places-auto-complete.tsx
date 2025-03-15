"use client";

import { FC, useState } from "react";
import { parse } from "valibot";

import { searchPlaces } from "@/app/trips/[id]/routes/new/actions";
import { debounce, isBlank } from "@/utils/shared";
import PlaceSuggestionsSchema, {
  PlaceSuggestions,
} from "@/utils/valibot/places-auto-complete-schema";

type PlacesAutoCompleteProps = {
  children: string;
};

export const PlacesAutoComplete: FC<PlacesAutoCompleteProps> = ({
  children,
}) => {
  const [placeSuggestion, setPlaceSuggestion] = useState<PlaceSuggestions>();

  const handleChange = debounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isBlank(e.target.value)) {
        return;
      }

      const data = await searchPlaces(e.target.value);

      try {
        const placeSuggestion = parse(PlaceSuggestionsSchema, data);
        console.log(placeSuggestion);
        setPlaceSuggestion(placeSuggestion);
      } catch (error) {
        console.error(error);
      }
    },
    700
  );

  return (
    <div>
      <label htmlFor={children.toLowerCase()}>{children}</label>
      <input
        id={children.toLocaleLowerCase()}
        name={children.toLocaleLowerCase()}
        type="text"
        onChange={handleChange}
      />
      <div>
        {placeSuggestion?.suggestions.map((suggestion, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "8px",
              margin: "4px 0",
              cursor: "pointer",
            }}
            onClick={() => console.log(suggestion)}
          >
            {suggestion.placePrediction.structuredFormat.mainText.text}
          </div>
        ))}
      </div>
    </div>
  );
};
