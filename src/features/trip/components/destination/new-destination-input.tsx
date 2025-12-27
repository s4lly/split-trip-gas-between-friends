"use client";

import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useRef } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PLACE_AUTOCOMPLETE_RADIUS_METERS } from "@/lib/constants";
import { tripPath } from "@/paths";
import { isBlank } from "@/utils/shared";
import { parseStringParam } from "@/utils/url";
import {
  EMPTY_PLACE_SUGGESTIONS,
  PlaceSuggestions,
} from "@/utils/valibot/places-auto-complete-schema";
import { getPlaceSuggestions } from "../../actions/get-place-suggestions";
import { MapStateContext } from "./map-state-provider";

interface NewDestinationInputProps {
  setPlaceSuggestions: (suggestions: PlaceSuggestions) => void;
  setSelectedPlaceId: React.Dispatch<React.SetStateAction<string | undefined>>;
  placeQuery: string;
  setPlaceQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SEARCH_DEBOUNCE_DELAY = 700; // milliseconds

export const NewDestinationInput = ({
  setPlaceSuggestions,
  setSelectedPlaceId,
  placeQuery,
  setPlaceQuery,
}: NewDestinationInputProps) => {
  const params = useParams<{ tripId: string }>();
  const tripId = parseStringParam(params.tripId);

  const { state: mapState } = useContext(MapStateContext);

  const inputElementRef = useRef<HTMLInputElement>(null);
  const queryTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // ----

  useEffect(() => {
    inputElementRef?.current?.focus();
  });

  // ----

  const handlePlaceQueryChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    clearTimeout(queryTimeoutIdRef.current);

    setSelectedPlaceId(undefined);
    setPlaceQuery(e.target.value);

    if (isBlank(e.target.value) || mapState.center === null) {
      setPlaceSuggestions(EMPTY_PLACE_SUGGESTIONS);
      return;
    }

    const center = mapState.center;

    queryTimeoutIdRef.current = setTimeout(async () => {
      setPlaceSuggestions(
        await getPlaceSuggestions(e.target.value, {
          latitude: center.lat,
          longitude: center.lng,
          radius: PLACE_AUTOCOMPLETE_RADIUS_METERS,
        }),
      );
    }, SEARCH_DEBOUNCE_DELAY);
  };

  const handleClearPlaceQuery = () => {
    clearTimeout(queryTimeoutIdRef.current);
    setPlaceSuggestions(EMPTY_PLACE_SUGGESTIONS);
    setSelectedPlaceId(undefined);
    setPlaceQuery("");
  };

  // ----

  return (
    <div className="-mx-3 flex items-center space-x-2">
      <Button asChild size="icon" variant="ghost">
        <Link href={tripPath(tripId)}>
          <ArrowLeft className="size-[24px]" />
        </Link>
      </Button>

      <Input
        type="text"
        ref={inputElementRef}
        value={placeQuery}
        onChange={handlePlaceQueryChange}
        className="border-0 px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      <Button size="icon" variant="ghost" onClick={handleClearPlaceQuery}>
        <X className="size-[24px]" />
      </Button>
    </div>
  );
};
