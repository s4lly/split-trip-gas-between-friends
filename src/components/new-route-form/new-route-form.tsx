"use client";

import { FC, useCallback, useState } from "react";
import { Form } from "@/components/form/form";
import { AutoCompleteInput } from "@/components/auto-complete-input/auto-complete-input";
import { createTripRoute } from "@/app/trips/[id]/routes/new/actions";
import { PlacePrediction } from "@/utils/valibot/places-auto-complete-schema";

type NewRouteFormProps = {
  tripId: number;
};

const NewRouteForm: FC<NewRouteFormProps> = ({ tripId }) => {
  const [placePrediction, setPlacePrediction] = useState<PlacePrediction>();

  const handleFormSubmit = useCallback(() => {
    if (placePrediction == undefined) {
      console.log("error: trying to create with missing 'place'");
      return;
    }

    createTripRoute(tripId, placePrediction);
  }, [placePrediction]);

  return (
    <Form>
      <AutoCompleteInput setPlacePrediction={setPlacePrediction}>
        Place
      </AutoCompleteInput>

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

export default NewRouteForm;
