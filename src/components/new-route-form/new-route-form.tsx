"use client";

import { FC } from "react";
import { Form } from "@/components/form/form";
import { AutoCompleteInput } from "@/components/auto-complete-input/auto-complete-input";
import { createTripRoute } from "@/app/trips/[id]/routes/new/actions";

type NewRouteFormProps = {
  tripId: number;
};

const NewRouteForm: FC<NewRouteFormProps> = ({ tripId }) => {
  const boundCreateTripRoute = createTripRoute.bind(null, tripId);

  return (
    <Form>
      <AutoCompleteInput>From</AutoCompleteInput>
      <AutoCompleteInput>To</AutoCompleteInput>
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
        formAction={boundCreateTripRoute}
        type="submit"
      >
        Submit
      </button>
    </Form>
  );
};

export default NewRouteForm;
