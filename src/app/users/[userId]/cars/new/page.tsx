import { Form } from "@/components/form/form";
import { FormInputText } from "@/components/form/FormInputText";
import { createVehicle } from "./actions";
import { redirect } from "next/navigation";

type NewCarPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function NewCarPage({ params }: NewCarPageProps) {
  const { userId } = await params;

  const userIdNum = parseInt(userId, 10);
  if (isNaN(userIdNum)) {
    console.log("users/[userId]/cars/new userId is not a num: ", userId);
    redirect("/error");
  }
  const boundCreateVehicle = createVehicle.bind(null, userIdNum);

  return (
    <>
      <h1>create new car</h1>
      <Form>
        <FormInputText label="Name" identifier="name" />
        <FormInputText label="MPG" identifier="mpg" />
        <FormInputText label="Make" identifier="model" />
        <FormInputText label="Model" identifier="model" />

        <button
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          formAction={boundCreateVehicle}
        >
          Create
        </button>
      </Form>
    </>
  );
}
