"use client";

import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { parse } from "valibot";
import { searchPlaces } from "@/app/trips/[id]/routes/new/actions";
import { createFormTitle, isBlank } from "@/utils/shared";
import {
  PlacePrediction,
  PlaceSuggestions,
  PlaceSuggestionsSchema,
} from "@/utils/valibot/places-auto-complete-schema";

type AutoCompleteInputProps = {
  children: string;
  setPlacePrediction: Dispatch<SetStateAction<PlacePrediction | undefined>>;
};

export const AutoCompleteInput: FC<AutoCompleteInputProps> = ({
  children,
  setPlacePrediction,
}) => {
  const formTitle = createFormTitle(children);

  const [value, setValue] = useState("");
  const [placeSuggestion, setPlaceSuggestion] = useState<PlaceSuggestions>();
  const isValueSelected = useRef(false);

  const getPlaceSuggestions = async (
    query: string,
  ): Promise<PlaceSuggestions> => {
    if (isBlank(query)) {
      return { suggestions: [] };
    }

    const data = await searchPlaces(query);

    try {
      const placeSuggestion = parse(PlaceSuggestionsSchema, data);
      return placeSuggestion;
    } catch (error) {
      console.error(error);
      return { suggestions: [] };
    }
  };

  const handleClickSuggestion = (placePrediction: PlacePrediction) => {
    isValueSelected.current = true;

    setValue(placePrediction.structuredFormat.mainText.text);
    setPlaceSuggestion({ suggestions: [] });

    setPlacePrediction(placePrediction);
  };

  useEffect(() => {
    if (isValueSelected.current) {
      isValueSelected.current = false;
      return;
    }

    const timeoutId = setTimeout(async () => {
      const placeSuggestions = await getPlaceSuggestions(value);
      setPlaceSuggestion(placeSuggestions);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [value, setPlaceSuggestion]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <label
        htmlFor={formTitle}
        className="mb-2 block text-sm font-medium text-gray-900"
      >
        {children}
      </label>
      <input
        id={formTitle}
        name={formTitle}
        type="text"
        value={value}
        onChange={handleChange}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
      />
      {(placeSuggestion?.suggestions?.length ?? 0) > 0 && (
        <ul>
          {placeSuggestion?.suggestions.map((suggestion) => (
            <li key={suggestion.placePrediction.placeId}>
              <button
                key={suggestion.placePrediction.placeId}
                className="block w-full border border-gray-300 p-2"
                onClick={() =>
                  handleClickSuggestion(suggestion.placePrediction)
                }
              >
                {suggestion.placePrediction.structuredFormat.mainText.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
