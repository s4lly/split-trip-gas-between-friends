import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { Header } from "@/components/header";
import { createClient } from "@/utils/supabase/server";
import { parseStringParam } from "@/utils/url";

type TripLayoutProps = {
  children: React.ReactNode;
  tripId: string;
};

export default async function TripLayout({
  children,
  tripId,
}: TripLayoutProps) {
  const supabase = await createClient();

  const tripIdNum = parseStringParam(tripId);
  const tripQuery = supabase
    .from("trip")
    .select("name")
    .eq("id", tripIdNum)
    .single();

  const { data: trip, error: tripError } = await tripQuery;
  if (tripError) {
    console.log(tripError);
    redirect("/error");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="bg-gray-100">
        <Header>
          <Link
            className="text-blue-600 underline hover:no-underline"
            href={`/trips/${tripId}`}
          >
            {trip.name}
          </Link>
        </Header>
      </div>
      <div className="grow px-4 pt-2 pb-4">{children}</div>
    </div>
  );
}
