import TripSubPageHeader from "@/components/TripSubPageHeader";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <TripSubPageHeader tripId={id} title="Report" />
      <p>report page</p>
    </>
  );
}
