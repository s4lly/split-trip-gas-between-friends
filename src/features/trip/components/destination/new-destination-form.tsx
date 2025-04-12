"use client";

import { FC, useCallback, useState } from "react";
import { Form } from "@/components/form/form";
import { PlaceSuggestionInput } from "@/components/place-suggestion-input";
import { createTripDestination } from "@/features/trip/actions/create-trip-destination";
import { PlacePrediction } from "@/utils/valibot/places-auto-complete-schema";

type NewDestinationFormProps = {
  tripId: number;
};

const NewDestinationForm: FC<NewDestinationFormProps> = ({ tripId }) => {
  const [placePrediction, setPlacePrediction] = useState<PlacePrediction>();

  const handleFormSubmit = useCallback(() => {
    if (placePrediction == undefined) {
      console.log("error: trying to create with missing 'place'");
      return;
    }

    createTripDestination(tripId, placePrediction);
  }, [tripId, placePrediction]);

  return (
    <Form>
      <PlaceSuggestionInput setPlacePrediction={setPlacePrediction}>
        Place
      </PlaceSuggestionInput>

      <button
        className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
        formAction={handleFormSubmit}
        type="submit"
      >
        Submit
      </button>
    </Form>
  );
};

export default NewDestinationForm;
