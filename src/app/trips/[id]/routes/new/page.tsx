import { use } from "react";
import { createTripRoute } from "./actions";
import { Form, FormInputText } from "@/components/form/form";
import { PlacesAutoComplete } from "@/components/places-auto-complete/places-auto-complete";

type NewRoutePageProps = {
  params: Promise<{ id: string }>;
};

export default function NewRoutePage({ params }: NewRoutePageProps) {
  const { id } = use(params);
  const tripId = parseInt(id, 10);

  if (isNaN(tripId)) {
    return <div>Invalid trip id</div>;
  }

  const boundCreateTripRoute = createTripRoute.bind(null, tripId);

  return (
    <>
      <h1>Create New Route</h1>

      <PlacesAutoComplete>From</PlacesAutoComplete>

      <Form>
        {/* // TODO auto fill with car and person */}
        <FormInputText label="To" identifier="to" />
        <button formAction={boundCreateTripRoute} type="submit">
          Submit
        </button>
      </Form>
    </>
  );
}
