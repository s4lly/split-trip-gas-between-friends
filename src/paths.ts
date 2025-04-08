export const tripPath = (tripId: string) => `/trips/${tripId}`;
export const routePath = (tripId: number | null, routeId: number) =>
  `/trips/${tripId}/routes/${routeId}`;
export const tripNewPath = () => "/trips/new";
export const errorPath = () => "/error";
export const loginPath = () => "/login";
export const setupPath = () => "/users/setup";
export const homePath = () => "/";
