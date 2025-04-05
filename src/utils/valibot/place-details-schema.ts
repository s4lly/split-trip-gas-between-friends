import { InferOutput, number, object } from "valibot";

// TODO colocate and add info about google api
// https://places.googleapis.com/v1/places/${placeId}
// https://developers.google.com/maps/documentation/places/web-service/place-details
// https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#Place

export const LocationSchema = object({
  latitude: number(),
  longitude: number(),
});

export const PlaceDetailsSchema = object({
  location: LocationSchema,
});

export type Location = InferOutput<typeof LocationSchema>;
export type PlaceDetails = InferOutput<typeof PlaceDetailsSchema>;
