export const getPlaceSuggestions = async (query: string) => {
  const response = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
      },
      body: JSON.stringify({
        input: query,
      }),
    },
  );

  const json = await response.json();

  return json;
};
