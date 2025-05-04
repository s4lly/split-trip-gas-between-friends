"use client";

import { ArrowLeft, X } from "lucide-react";
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
  EMPTY_PLACE_SUGGESTIONS,
  PlacePrediction,
  PlaceSuggestions,
} from "@/utils/valibot/places-auto-complete-schema";
import { getPlaceSuggestionsGraph } from "../../actions/get-place-suggestions-graph";
import { PlaceSuggestionList } from "./place-suggestion-list";
import { SelectedDestinationDetails } from "./selected-destination-details";

const SEARCH_DEBOUNCE_DELAY = 700; // milliseconds

export const NewDestinationForm = () => {
  const params = useParams<{ tripId: string }>();
  const tripId = parseStringParam(params.tripId);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const isQueryChangedFromSelection = useRef(false);

  const [selectedDestination, setSelectedDestination] =
    useState<PlacePrediction>();
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestions>();
  const [placeSuggestionsGraph, setPlaceSuggestionsGraph] =
    useState<MapGraph | null>(null);

  // ----

  useEffect(() => {
    inputRef?.current?.focus();
  });

  // run when query changes, update suggestions
  // all other state should have been set by the time this runs
  useEffect(() => {
    if (isQueryChangedFromSelection.current) {
      isQueryChangedFromSelection.current = false;
      return;
    }

    const timeoutId = setTimeout(async () => {
      // update suggestions based on query
      const placeSuggestions = isBlank(query)
        ? EMPTY_PLACE_SUGGESTIONS
        : await getPlaceSuggestions(query);
      setPlaceSuggestions(placeSuggestions);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [query, setPlaceSuggestions, setPlaceSuggestionsGraph]);

  // run when suggestions changes, update map graph
  useEffect(() => {
    const updateMapGraph = async () => {
      // either showing suggestions or showing selected
      let workingPlaceSuggestions = placeSuggestions;

      if (selectedDestination) {
        workingPlaceSuggestions = {
          suggestions: [{ placePrediction: selectedDestination }],
        };
      }

      setPlaceSuggestionsGraph(
        await getPlaceSuggestionsGraph(workingPlaceSuggestions),
      );
    };

    updateMapGraph();
  }, [placeSuggestions, selectedDestination]);

  // ----

  const handleFormSubmit = () => {
    if (selectedDestination == undefined) {
      console.error("cannot create 'empty' destination");
      return;
    }

    createTripDestination(tripId, selectedDestination);
  };

  // ----

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClickSuggestion = (placePrediction: PlacePrediction) => {
    // signal that the destination is selected
    isQueryChangedFromSelection.current = true;

    setPlaceSuggestions(EMPTY_PLACE_SUGGESTIONS);

    setQuery(placePrediction.structuredFormat.mainText.text);
    setSelectedDestination(placePrediction);
  };

  const handleClearQuery = () => {
    setQuery("");
    setSelectedDestination(undefined);
  };

  // ----

  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow space-y-1">
        <div className="-mx-4 h-[200px]">
          {/* suggestions or seleted */}
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
            value={query}
            onChange={handleChange}
            className="border-0 px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <Button size="icon" variant="ghost" onClick={handleClearQuery}>
            <X className="size-[24px]" />
          </Button>
        </div>

        <Separator />

        <PlaceSuggestionList
          placeSuggestions={placeSuggestions}
          handleClickSuggestion={handleClickSuggestion}
        />

        {selectedDestination && (
          <SelectedDestinationDetails
            destinationGraph={placeSuggestionsGraph}
          />
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
