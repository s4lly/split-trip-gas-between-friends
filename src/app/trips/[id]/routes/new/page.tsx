import { use } from "react";
import NewRouteForm from "@/components/new-route-form/new-route-form";
import TripSubPageHeader from "@/components/TripSubPageHeader";

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
      <TripSubPageHeader tripId={id} title="Create Route" />
      <NewRouteForm tripId={tripId} />
    </>
  );
}
