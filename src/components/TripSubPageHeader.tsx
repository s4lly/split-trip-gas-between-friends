import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import React from "react";

const TripSubPageHeader = ({
  tripId,
  title,
}: {
  tripId: string;
  title: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/trips/${tripId}`}>
        <ArrowLeft className="size-6 text-gray-500" />
      </Link>
      <h1>{title}</h1>
    </div>
  );
};

export default TripSubPageHeader;
