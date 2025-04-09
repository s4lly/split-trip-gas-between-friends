export const routePath = (tripId: number | null, routeId: number) =>
  `/trips/${tripId}/routes/${routeId}`;
export const tripNewPath = () => "/trips/new";
export const errorPath = () => "/error";
export const loginPath = () => "/login";
export const setupPath = () => "/users/setup";
export const homePath = () => "/";

export const tripPath = (tripId: string | string[] | undefined) => {
  if (Array.isArray(tripId) || tripId === undefined) {
    // TODO o11y
    console.error(`tripPath: tripId is invalid ${tripId}`);
    return errorPath();
  }

  return `/trips/${tripId}`;
};
