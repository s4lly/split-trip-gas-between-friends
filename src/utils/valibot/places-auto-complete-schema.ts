import { object, array, string, optional, number, InferOutput } from "valibot";

// Define the match schema
const MatchSchema = object({
  startOffset: optional(number()),
  endOffset: optional(number()),
});

// Define the text schema
const TextSchema = object({
  text: string(),
  matches: optional(array(MatchSchema)),
});

// Define the structured format schema
const StructuredFormatSchema = object({
  mainText: TextSchema,
  secondaryText: TextSchema,
});

// Define the place prediction schema
export const PlacePredictionSchema = object({
  place: string(),
  placeId: string(),
  text: TextSchema,
  structuredFormat: StructuredFormatSchema,
  types: array(string()),
});

// Define the suggestion schema
const SuggestionSchema = object({
  placePrediction: PlacePredictionSchema,
});

// Define the root schema
export const PlaceSuggestionsSchema = object({
  suggestions: array(SuggestionSchema),
});

// Type for the validated output
export type PlaceSuggestions = InferOutput<typeof PlaceSuggestionsSchema>;
export type PlacePredication = InferOutput<typeof PlacePredictionSchema>;

// Example usage:
// try {
//   const validatedData = parse(PlaceSuggestionsSchema, inputData);
//   console.log('Data is valid:', validatedData);
// } catch (error) {
//   if (error instanceof ValiError) {
//     console.error('Validation failed:', error.issues);
//   } else {
//     console.error('Unexpected error:', error);
//   }
// }
