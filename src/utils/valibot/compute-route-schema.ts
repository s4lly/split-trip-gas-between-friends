import { array, InferOutput, number, object, string } from "valibot";

// https://routes.googleapis.com/directions/v2:computeRoutes
// https://developers.google.com/maps/documentation/routes/compute_route_directions
// https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes

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
export const ComputeRoutesSchema = object({
  routes: array(RouteSchema),
});

// Type for the validated data
export type ComputedRoutes = InferOutput<typeof ComputeRoutesSchema>;
export type ComputedRoute = InferOutput<typeof RouteSchema>;
