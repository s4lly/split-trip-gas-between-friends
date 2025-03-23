"use client";

import { FC, useCallback, useState } from "react";
import { Form } from "@/components/form/form";
import { AutoCompleteInput } from "@/components/auto-complete-input/auto-complete-input";
import { createTripRoute } from "@/app/trips/[id]/routes/new/actions";
import { PlacePredication } from "@/utils/valibot/places-auto-complete-schema";

type NewRouteFormProps = {
  tripId: number;
};

const NewRouteForm: FC<NewRouteFormProps> = ({ tripId }) => {
  const [fromPlacePrediction, setFromPlacePrediction] =
    useState<PlacePredication>();
  const [toPlacePrediction, setToPlacePrediction] =
    useState<PlacePredication>();

  const handleFormSubmit = useCallback(() => {
    if (fromPlacePrediction == undefined || toPlacePrediction == undefined) {
      console.log(
        "error: trying to create with missing 'from' or 'to' place prediction"
      );
      return;
    }

    createTripRoute(tripId, fromPlacePrediction, toPlacePrediction);
  }, [fromPlacePrediction, toPlacePrediction]);

  return (
    <Form>
      <AutoCompleteInput setPlacePrediction={setFromPlacePrediction}>
        From
      </AutoCompleteInput>

      <AutoCompleteInput setPlacePrediction={setToPlacePrediction}>
        To
      </AutoCompleteInput>

      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
        formAction={handleFormSubmit}
        type="submit"
      >
        Submit
      </button>
    </Form>
  );
};

export default NewRouteForm;
