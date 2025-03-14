import { Form, FormInputText } from "@/components/form/form";
import { createTripRoute } from "./actions";

type NewRoutePageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewRoutePage({ params }: NewRoutePageProps) {
  const { id } = await params;
  const tripId = parseInt(id, 10);

  if (isNaN(tripId)) {
    return <div>Invalid trip id</div>;
  }

  const boundCreateTripRoute = createTripRoute.bind(null, tripId);

  return (
    <div>
      <h1>Create New Route</h1>
      // TODO auto fill with car and person
      <Form>
        <FormInputText label="From" identifier="from" />
        <FormInputText label="To" identifier="to" />
        <button formAction={boundCreateTripRoute} type="submit">
          Submit
        </button>
      </Form>
    </div>
  );
}
