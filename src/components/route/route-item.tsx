"use client";

import { Route } from "@/lib/types";
import { PlacePredictionSchema } from "@/utils/valibot/places-auto-complete-schema";
import { DotsSixVertical } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { FC } from "react";
import { parse, ValiError } from "valibot";

type RouteCardProps = {
  route: Route;
  tripId: number;
};

const RouteItem: FC<RouteCardProps> = ({ route, tripId }) => {
  let placeText: string | null = "";

  try {
    const place = parse(PlacePredictionSchema, route.place);
    placeText = place.structuredFormat.mainText.text;
  } catch (error) {
    if (error instanceof ValiError) {
      console.error("Validation failed:", error.issues);
    } else {
      console.error("Unexpected error:", error);
    }
  }

  return (
    <li className="flex cursor-pointer gap-2 border-gray-200 p-2 hover:bg-gray-100 hover:text-blue-700">
      <div className="flex shrink-0 items-center justify-center">
        <DotsSixVertical />
      </div>
      <div className="grow-1">
        <div>
          <Link href={`/trips/${tripId}/routes/${route.id}`}>{placeText}</Link>
        </div>
      </div>
    </li>
  );
};

export default RouteItem;
