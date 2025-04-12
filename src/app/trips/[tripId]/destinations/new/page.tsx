import { use } from "react";
import NewDestinationForm from "@/features/trip/components/destination/new-destination-form";

type NewRoutePageProps = {
  params: Promise<{ tripId: string }>;
};

export default function NewRoutePage({ params }: NewRoutePageProps) {
  const { tripId } = use(params);
  const tripIdNum = parseInt(tripId, 10);

  if (isNaN(tripIdNum)) {
    return <div>Invalid trip id</div>;
  }

  return (
    <>
      <NewDestinationForm tripId={tripIdNum} />
    </>
  );
}
