import { array, InferOutput, number, object, string } from "valibot";

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

const SinglePlacePhotoSchema = object({
  name: string(),
  widthPx: number(),
  heightPx: number(),
});

export const PlacePhotoSchema = object({
  photos: array(SinglePlacePhotoSchema),
});

export const PlacePhotoContentSchema = object({
  name: string(),
  photoUri: string(),
});

export type Location = InferOutput<typeof LocationSchema>;
export type PlaceDetails = InferOutput<typeof PlaceDetailsSchema>;
export type PlacePhoto = InferOutput<typeof SinglePlacePhotoSchema>;
export type PlacePhotoContent = InferOutput<typeof PlacePhotoContentSchema>;
