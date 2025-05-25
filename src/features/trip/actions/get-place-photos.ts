"use server";

import { redirect } from "next/navigation";
import { parse, ValiError } from "valibot";
import { errorPath } from "@/paths";
import {
  PlacePhotoContent,
  PlacePhotoContentSchema,
  PlacePhotoSchema,
} from "@/utils/valibot/place-details-schema";
import { PlacePrediction } from "@/utils/valibot/places-auto-complete-schema";

export async function getPlacePhotos(
  place: PlacePrediction,
): Promise<PlacePhotoContent[]> {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${place.placeId}`,
    {
      headers: {
        "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        "X-Goog-FieldMask": "photos.name,photos.widthPx,photos.heightPx",
      },
    },
  );

  if (!response.ok) {
    // TODO o11y
    console.error(
      `Failed to fetch photos for placeId: ${place.placeId}. Status: ${response.status}, StatusText: ${response.statusText}`,
    );

    redirect(errorPath());
  }

  const data = await response.json();

  try {
    const { photos } = parse(PlacePhotoSchema, data);

    const photosWithContent = await Promise.all(
      photos.map(async (photo) => {
        const url = new URL(
          `https://places.googleapis.com/v1/${photo.name}/media`,
        );
        url.searchParams.set("maxWidthPx", "500");
        url.searchParams.set("skipHttpRedirect", "true");

        const contentResponse = await fetch(url, {
          headers: {
            "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
          },
        });

        if (!contentResponse.ok) {
          console.error(
            `Failed to fetch photo content for ${photo.name}. Status: ${contentResponse.status}, StatusText: ${contentResponse.statusText}`,
          );
          return undefined;
        }

        let placePhotoContent: PlacePhotoContent | undefined;
        try {
          const contentData = await contentResponse.json();
          placePhotoContent = parse(PlacePhotoContentSchema, contentData);
        } catch (error) {
          console.error(`Error parsing photo content: ${error}`);
        }

        return placePhotoContent;
      }),
    );

    return photosWithContent.filter((photo) => photo !== undefined);
  } catch (error) {
    if (error instanceof ValiError) {
      // TODO o11y
      console.error(
        `Validation error for placeId: ${place.placeId}. Error: ${error.message}`,
      );
    } else {
      console.error(
        `Unexpected error for placeId: ${place.placeId}. Error: ${error}`,
      );
    }

    redirect(errorPath());
  }
}
