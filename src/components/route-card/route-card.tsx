import { Route } from "@/lib/types";
import { PlacePredictionSchema } from "@/utils/valibot/places-auto-complete-schema";
import { DotsSixVertical } from "@phosphor-icons/react/dist/ssr";
import { FC } from "react";
import { parse, ValiError } from "valibot";

type RouteCardProps = {
  route: Route;
};

const RouteCard: FC<RouteCardProps> = ({ route }) => {
  let startText: string | null = "";
  let endText: string | null = "";

  try {
    const startPlacePrediction = parse(PlacePredictionSchema, route.start);
    startText = startPlacePrediction.structuredFormat.mainText.text;

    const endPlacePrediction = parse(PlacePredictionSchema, route.end);
    endText = endPlacePrediction.structuredFormat.mainText.text;
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
        <div>from: {startText ?? "no start"}</div>
        <div>to: {endText ?? "no end"}</div>
      </div>
    </li>
  );
};

export default RouteCard;
