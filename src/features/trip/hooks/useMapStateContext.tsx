import { use } from "react";
import { MapStateContext } from "@/features/trip/components/destination/map-state-provider";

export default function useMapStateContext() {
  const context = use(MapStateContext);

  if (!context) {
    throw new Error(
      "useMapStateContext must be used within a MapStateProvider",
    );
  }

  return context;
}
