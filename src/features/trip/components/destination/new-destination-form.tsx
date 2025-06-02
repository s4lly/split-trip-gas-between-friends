"use client";

import clsx from "clsx";
import Autoplay from "embla-carousel-autoplay";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Map } from "@/components/map";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { MapGraph } from "@/features/trip/types";
import { Profile as TripUser, Route, Vehicle } from "@/lib/types";
import { parseStringParam } from "@/utils/url";
import { PlacePhotoContent } from "@/utils/valibot/place-details-schema";
import {
  EMPTY_PLACE_SUGGESTIONS,
  PlacePrediction,
  PlaceSuggestions,
} from "@/utils/valibot/places-auto-complete-schema";
import { createTripDestination } from "../../actions/create-trip-destination";
import { getPlacePhotos } from "../../actions/get-place-photos";
import { getPlaceSuggestionsGraph } from "../../actions/get-place-suggestions-graph";
import { MapStateProvider } from "./map-state-provider";
import { NewDestinationInput } from "./new-destination-input";
import { PlaceSuggestionList } from "./place-suggestion-list";
import { SelectedDestinationDetails } from "./selected-destination-details";

export const NewDestinationForm = ({
  vehicles,
  users,
}: {
  vehicles: Vehicle[];
  users: TripUser[];
}) => {
  const params = useParams<{ tripId: string }>();
  const tripId = parseStringParam(params.tripId);

  const [isMapLoading, startMapLoadingTransition] = useTransition();
  const [selectedPlace, setSelectedPlace] = useState<PlacePrediction>();
  const [placePhotos, setPlacePhotos] = useState<PlacePhotoContent[]>([]);

  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestions>();
  const [placeSuggestionsGraph, setPlaceSuggestionsGraph] =
    useState<MapGraph | null>(null);

  // meant only for backend to keep track of potential new destination details
  // this is not used for the UI.
  const newDestinationDetails = useRef<Partial<Route>>({});

  // ----

  // run when suggestions changes, update map graph
  useEffect(() => {
    let ignore = false;

    startMapLoadingTransition(async () => {
      // either showing suggestions or showing selected
      let workingPlaceSuggestions = placeSuggestions;

      if (selectedPlace) {
        workingPlaceSuggestions = {
          suggestions: [{ placePrediction: selectedPlace }],
        };
      }

      const graph = await getPlaceSuggestionsGraph(workingPlaceSuggestions);

      if (!ignore) {
        setPlaceSuggestionsGraph(graph);
      }
    });

    return () => {
      ignore = true;
    };
  }, [placeSuggestions, selectedPlace]);

  useEffect(() => {
    const startNode = placeSuggestionsGraph?.start;

    if (startNode?.type === "suggestion") {
      getPlacePhotos(startNode.placeSuggestion).then((photos) => {
        setPlacePhotos(photos);
      });
    } else {
      setPlacePhotos([]);
    }
  }, [placeSuggestionsGraph?.start]);

  // ----

  const handleFormSubmit = () => {
    if (selectedPlace == undefined) {
      console.error("cannot create 'empty' destination");
      return;
    }

    createTripDestination(tripId, selectedPlace, newDestinationDetails.current);
  };

  // ----

  const handleClickSuggestion = (placePrediction: PlacePrediction) => {
    setPlaceSuggestions(EMPTY_PLACE_SUGGESTIONS);
    setSelectedPlace(placePrediction);
  };

  const handleUpdateDestinationDetails = useCallback(
    (destinationDetailUpdates: Partial<Route>) => {
      newDestinationDetails.current = {
        ...newDestinationDetails.current,
        ...Object.fromEntries(
          Object.entries(destinationDetailUpdates).filter(
            ([, value]) => value !== undefined,
          ),
        ),
      };
    },
    [],
  );

  // ----

  return (
    <MapStateProvider>
      <div className="flex h-full flex-col">
        <div className="flex-grow space-y-1">
          <div className="flex">
            <div
              className={clsx(
                "relative h-[200px] flex-1",
                selectedPlace ? "-ml-4" : "-mx-4",
              )}
            >
              <Map mapGraph={placeSuggestionsGraph} />

              {isMapLoading && (
                <div className="absolute inset-0 bg-black/50">
                  <div className="grid h-full w-full place-items-center">
                    <Loader2 className="size-10 animate-spin text-white" />
                  </div>
                </div>
              )}
            </div>

            {selectedPlace && (
              <Carousel
                className="-mr-4 flex-1"
                plugins={[
                  Autoplay({
                    delay: 2000,
                  }),
                ]}
              >
                <CarouselContent>
                  {placePhotos.map((photo, index) => (
                    <CarouselItem className="h-[200px]" key={index}>
                      <Image
                        src={photo.photoUri}
                        alt={`Place photo ${index + 1}`}
                        width={800}
                        height={600}
                        className="aspect-square h-full w-full object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )}
          </div>

          <NewDestinationInput
            setPlaceSuggestions={setPlaceSuggestions}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
          />

          <Separator />

          {placeSuggestions && placeSuggestions.suggestions.length > 0 && (
            <PlaceSuggestionList
              placeSuggestions={placeSuggestions}
              handleClickSuggestion={handleClickSuggestion}
            />
          )}

          {selectedPlace && placeSuggestionsGraph && (
            <SelectedDestinationDetails
              destinationGraph={placeSuggestionsGraph}
              updateNewDestinationDetails={handleUpdateDestinationDetails}
              vehicles={vehicles}
              users={users}
            />
          )}
        </div>

        <div className="mt-auto w-full">
          <Button className="w-full" onClick={handleFormSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </MapStateProvider>
  );
};
