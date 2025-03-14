import { Form, FormInputText } from "@/components/form/form";
import { createTrip } from "./actions";

export default function TripsNew() {
  return (
    <div>
      <h2>trips - new</h2>

      <Form>
        <FormInputText label="Name" identifier="name" />
        <button formAction={createTrip}>Create</button>
      </Form>
    </div>
  );
}
