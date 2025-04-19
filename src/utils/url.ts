import { redirect } from "next/navigation";
import { errorPath, joinPath } from "@/paths";

export function getSingleSearchParam(
  searchParams: { [key: string]: string | string[] | undefined },
  key: string,
): string {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    console.error(`Expected a single value for "${key}", but got an array.`);
    redirect(errorPath());
  }

  if (value === undefined) {
    console.error(`Missing required search parameter: "${key}".`);
    redirect(errorPath());
  }

  return value;
}

export const parseStringParam = (paramString: string): number => {
  const paramNumber = parseInt(paramString, 10);

  if (isNaN(paramNumber)) {
    console.error("failed to parse string param to a number: ", paramString);
    redirect(errorPath());
  }

  return paramNumber;
};

export const getJoinUrl = (tripId: string): string => {
  const baseUrl =
    process.env.NODE_ENV === "development" || !process.env.VERCEL_URL
      ? "http://localhost:3000"
      : `https://${process.env.VERCEL_URL}`;

  const searchParams = new URLSearchParams({ tripId });
  return new URL(joinPath(searchParams), baseUrl).toString();
};
