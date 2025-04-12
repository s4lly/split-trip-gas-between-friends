import { use } from "react";
import NewDestinationForm from "@/features/trip/components/destination/new-destination-form";

type NewRoutePageProps = {
  params: Promise<{ id: string }>;
};

export default function NewRoutePage({ params }: NewRoutePageProps) {
  const { id } = use(params);
  const tripId = parseInt(id, 10);

  if (isNaN(tripId)) {
    return <div>Invalid trip id</div>;
  }

  return (
    <>
      <NewDestinationForm tripId={tripId} />
    </>
  );
}
