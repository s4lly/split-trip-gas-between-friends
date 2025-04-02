import { array, InferOutput, number, object, optional, string } from "valibot";

const MatchSchema = object({
  startOffset: optional(number()),
  endOffset: optional(number()),
});

const TextSchema = object({
  text: string(),
  matches: optional(array(MatchSchema)),
});

const StructuredFormatSchema = object({
  mainText: TextSchema,
  secondaryText: TextSchema,
});

export const PlacePredictionSchema = object({
  place: string(),
  placeId: string(),
  text: TextSchema,
  structuredFormat: StructuredFormatSchema,
  types: array(string()),
});

const SuggestionSchema = object({
  placePrediction: PlacePredictionSchema,
});

export const PlaceSuggestionsSchema = object({
  suggestions: array(SuggestionSchema),
});

export type PlaceSuggestions = InferOutput<typeof PlaceSuggestionsSchema>;
export type PlacePrediction = InferOutput<typeof PlacePredictionSchema>;
