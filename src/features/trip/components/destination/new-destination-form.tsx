"use client";

import clsx from "clsx";
import Autoplay from "embla-carousel-autoplay";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { MapComponent } from "@/components/map-component";
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
  PlacePrediction,
  PlaceSuggestions,
} from "@/utils/valibot/places-auto-complete-schema";
import { createTripDestination } from "../../actions/create-trip-destination";
import { getPlacePhotos } from "../../actions/get-place-photos";
import { getPlaceSuggestionsGraph } from "../../actions/get-place-suggestions-graph";
import { findSelectedSuggestionNode } from "../../utils";
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
  const [placeQuery, setPlaceQuery] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>();
  const [placePhotos, setPlacePhotos] = useState<PlacePhotoContent[]>([]);
  const [isPlaceSuggestionSelected, setIsPlaceSuggestionSelected] =
    useState(false);

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
      // generates marker symbol
      const graph = await getPlaceSuggestionsGraph(placeSuggestions);

      if (!ignore) {
        setPlaceSuggestionsGraph(graph);
      }
    });

    return () => {
      ignore = true;
    };
  }, [placeSuggestions]);

  useEffect(() => {
    const selectedSuggestionNode = findSelectedSuggestionNode(
      placeSuggestionsGraph,
      selectedPlaceId,
    );

    if (selectedSuggestionNode) {
      getPlacePhotos(selectedSuggestionNode.placeSuggestion).then((photos) => {
        setPlacePhotos(photos);
      });
    } else {
      setPlacePhotos([]);
    }
  }, [placeSuggestionsGraph, selectedPlaceId]);

  // ----

  const selectedSuggestion = placeSuggestions?.suggestions.find(
    (suggestion) => suggestion.placePrediction.placeId === selectedPlaceId,
  );

  const handleFormSubmit = () => {
    if (selectedPlaceId == undefined) {
      console.error("cannot create 'empty' destination");
      return;
    }

    if (selectedSuggestion?.placePrediction) {
      createTripDestination(
        tripId,
        selectedSuggestion?.placePrediction,
        newDestinationDetails.current,
      );
    }
  };

  // ----

  const handleClickSuggestion = (placePrediction: PlacePrediction) => {
    setSelectedPlaceId(placePrediction.placeId);
    setIsPlaceSuggestionSelected(true);
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
      <div className="flex h-full flex-col gap-2">
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          {/* Map and photos */}
          <div className="flex shrink-0">
            <div
              className={clsx(
                "relative h-[200px] flex-1",
                !isPlaceSuggestionSelected && "-mx-4",
                isPlaceSuggestionSelected && "-ml-4",
              )}
            >
              <MapComponent
                graph={placeSuggestionsGraph}
                selected={selectedPlaceId}
              />

              {isMapLoading && (
                <div className="absolute inset-0 bg-black/50">
                  <div className="grid h-full w-full place-items-center">
                    <Loader2 className="size-10 animate-spin text-white" />
                  </div>
                </div>
              )}
            </div>

            {isPlaceSuggestionSelected && (
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

          {!isPlaceSuggestionSelected && (
            <NewDestinationInput
              setPlaceSuggestions={setPlaceSuggestions}
              setSelectedPlaceId={setSelectedPlaceId}
              placeQuery={placeQuery}
              setPlaceQuery={setPlaceQuery}
            />
          )}

          {!isPlaceSuggestionSelected && <Separator />}

          {!isPlaceSuggestionSelected && (
            <PlaceSuggestionList
              placeSuggestionsGraph={placeSuggestionsGraph}
              handleClickSuggestion={handleClickSuggestion}
            />
          )}

          {isPlaceSuggestionSelected && placeSuggestionsGraph && (
            <SelectedDestinationDetails
              placeSuggestionsGraph={placeSuggestionsGraph}
              updateNewDestinationDetails={handleUpdateDestinationDetails}
              selectedPlaceId={selectedPlaceId}
              setSelectedPlaceId={setSelectedPlaceId}
              vehicles={vehicles}
              users={users}
              setIsPlaceSuggestionSelected={setIsPlaceSuggestionSelected}
            />
          )}
        </div>

        {isPlaceSuggestionSelected && (
          <div className="mb-2 w-full shrink-0">
            <Button className="w-full" onClick={handleFormSubmit}>
              Add
            </Button>
          </div>
        )}
      </div>
    </MapStateProvider>
  );
};
