import { createTrip } from "./actions";
import { Form } from "@/components/form/form";
import { FormInputText } from "@/components/form/FormInputText";
import { ArrowLeft, User } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function TripsNew() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Link href="/">
          <ArrowLeft className="size-6 text-gray-500" />
        </Link>
        <h2 className="text-2xl font-extrabold">Trips / new</h2>
      </div>

      <Form>
        <FormInputText label="Name" identifier="name" />
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
          formAction={createTrip}
        >
          Create
        </button>
      </Form>
    </div>
  );
}
