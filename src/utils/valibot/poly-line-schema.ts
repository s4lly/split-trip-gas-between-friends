import { array, InferOutput, number, object, string } from "valibot";

// Define the polyline schema
const PolylineSchema = object({
  encodedPolyline: string(),
});

// Define the route schema
const RouteSchema = object({
  distanceMeters: number(),
  duration: string(),
  polyline: PolylineSchema,
});

// Define the main response schema
export const RoutesResponseSchema = object({
  routes: array(RouteSchema),
});

// Type for the validated data
export type RoutesResponse = InferOutput<typeof RoutesResponseSchema>;
