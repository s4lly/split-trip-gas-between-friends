"use client";

import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Map } from "@/components/map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createTripDestination } from "@/features/trip/actions/create-trip-destination";
import { getPlaceSuggestions } from "@/features/trip/actions/get-place-suggestions";
import { MapGraph } from "@/features/trip/types";
import { tripPath } from "@/paths";
import { isBlank } from "@/utils/shared";
import { parseStringParam } from "@/utils/url";
import {
  PlacePrediction,
  PlaceSuggestions,
} from "@/utils/valibot/places-auto-complete-schema";
import { getPlaceSuggestionsGraph } from "../../actions/get-place-suggestions-graph";

export const NewDestinationForm = () => {
  const params = useParams<{ tripId: string }>();
  const tripId = parseStringParam(params.tripId);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");
  const isValueSelected = useRef(false);

  const [placePrediction, setPlacePrediction] = useState<PlacePrediction>();
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestions>();
  const [placeSuggestionsGraph, setPlaceSuggestionsGraph] =
    useState<MapGraph | null>(null);

  // ----

  useEffect(() => {
    inputRef?.current?.focus();
  });

  useEffect(() => {
    if (isValueSelected.current) {
      isValueSelected.current = false;
      return;
    }

    const timeoutId = setTimeout(async () => {
      const placeSuggestions = isBlank(value)
        ? { suggestions: [] }
        : await getPlaceSuggestions(value);
      setPlaceSuggestions(placeSuggestions);
      setPlaceSuggestionsGraph(
        await getPlaceSuggestionsGraph(placeSuggestions),
      );
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [value, setPlaceSuggestions, setPlaceSuggestionsGraph]);

  // ----

  const handleFormSubmit = () => {
    if (placePrediction == undefined) {
      console.error("cannot create 'empty' destination");
      return;
    }

    createTripDestination(tripId, placePrediction);
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
    <div className="flex h-full flex-col">
      <div className="flex-grow space-y-1">
        <div className="-mx-4 h-[200px]">
          <Map mapGraph={placeSuggestionsGraph} />
        </div>

        <div className="-mx-3 flex items-center space-x-2">
          <Button asChild size="icon" variant="ghost">
            <Link href={tripPath(tripId)}>
              <ArrowLeft className="size-[24px]" />
            </Link>
          </Button>
          <Input
            type="text"
            ref={inputRef}
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
      </div>

      <div className="mt-auto w-full">
        <Button className="w-full" onClick={handleFormSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};
