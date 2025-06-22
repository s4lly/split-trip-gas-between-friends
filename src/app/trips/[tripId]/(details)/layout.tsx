import TripLayout from "@/features/trip/components/trip-layout";

export default async function Layout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const params = await paramsPromise;
  return <TripLayout tripId={params.tripId}>{children}</TripLayout>;
}
