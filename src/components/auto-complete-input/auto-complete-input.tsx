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
  PlacePredication,
  PlaceSuggestions,
  PlaceSuggestionsSchema,
} from "@/utils/valibot/places-auto-complete-schema";

type AutoCompleteInputProps = {
  children: string;
  setPlacePrediction: Dispatch<SetStateAction<PlacePredication | undefined>>;
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
    query: string
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

  const handleClickSuggestion = (placePrediction: PlacePredication) => {
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
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {children}
      </label>
      <input
        id={formTitle}
        name={formTitle}
        type="text"
        value={value}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
      <div>
        {placeSuggestion?.suggestions.map((suggestion) => (
          <div
            key={suggestion.placePrediction.placeId}
            style={{
              border: "1px solid #ccc",
              padding: "8px",
              margin: "4px 0",
              cursor: "pointer",
            }}
            onClick={() => handleClickSuggestion(suggestion.placePrediction)}
          >
            {suggestion.placePrediction.structuredFormat.mainText.text}
          </div>
        ))}
      </div>
    </div>
  );
};
