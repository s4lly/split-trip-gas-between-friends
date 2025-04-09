export function getSingleSearchParam(
  searchParams: { [key: string]: string | string[] | undefined },
  key: string,
): string {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    throw new Error(`Expected a single value for "${key}", but got an array.`);
  }

  if (value === undefined) {
    throw new Error(`Missing required search parameter: "${key}".`);
  }

  return value;
}
