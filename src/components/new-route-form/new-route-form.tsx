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
      <button formAction={boundCreateTripRoute} type="submit">
        Submit
      </button>
    </Form>
  );
};

export default NewRouteForm;
