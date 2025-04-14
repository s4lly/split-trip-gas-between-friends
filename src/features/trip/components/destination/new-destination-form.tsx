"use client";

import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { parse } from "valibot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createTripDestination } from "@/features/trip/actions/create-trip-destination";
import { getPlaceSuggestions } from "@/features/trip/actions/get-place-suggestions";
import { tripPath } from "@/paths";
import { isBlank } from "@/utils/shared";
import { parseStringParam } from "@/utils/url";
import {
  PlacePrediction,
  PlaceSuggestions,
  PlaceSuggestionsSchema,
} from "@/utils/valibot/places-auto-complete-schema";

export const NewDestinationForm = () => {
  const params = useParams<{ tripId: string }>();
  const tripId = parseStringParam(params.tripId);

  const [value, setValue] = useState("");
  const isValueSelected = useRef(false);

  const [placePrediction, setPlacePrediction] = useState<PlacePrediction>();
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestions>();

  // ----

  useEffect(() => {
    if (isValueSelected.current) {
      isValueSelected.current = false;
      return;
    }

    const timeoutId = setTimeout(async () => {
      const placeSuggestions = await fetchPlaceSuggestions(value);
      setPlaceSuggestions(placeSuggestions);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [value, setPlaceSuggestions]);

  // ----

  const handleFormSubmit = () => {
    if (placePrediction == undefined) {
      console.error("cannot create 'empty' destination");
      return;
    }

    createTripDestination(tripId, placePrediction);
  };

  const fetchPlaceSuggestions = async (
    query: string,
  ): Promise<PlaceSuggestions> => {
    if (isBlank(query)) {
      return { suggestions: [] };
    }

    const data = await getPlaceSuggestions(query);

    try {
      // TODO move to backend
      const placeSuggestions = parse(PlaceSuggestionsSchema, data);
      return placeSuggestions;
    } catch (error) {
      console.error(error);
      return { suggestions: [] };
    }
  };

  // ----

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClickSuggestion = (placePrediction: PlacePrediction) => {
    isValueSelected.current = true;

    setValue(placePrediction.structuredFormat.mainText.text);
    setPlaceSuggestions({ suggestions: [] });

    setPlacePrediction(placePrediction);
  };

  // ----

  return (
    <div className="space-y-2">
      <div className="-mx-3 flex items-center">
        <Button asChild size="icon" variant="ghost">
          <Link href={tripPath(tripId)}>
            <ArrowLeft />
          </Link>
        </Button>
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          className="border-0 px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <Separator />

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

      <Button className="w-full" onClick={handleFormSubmit}>
        Submit
      </Button>
    </div>
  );
};
