import { object, number, InferOutput } from "valibot";

export const LocationSchema = object({
  latitude: number(),
  longitude: number(),
});

export const PlaceDetailsSchema = object({
  location: LocationSchema,
});

export type Location = InferOutput<typeof LocationSchema>;
export type PlaceDetails = InferOutput<typeof PlaceDetailsSchema>;
