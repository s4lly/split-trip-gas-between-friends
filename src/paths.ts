type SearchParam = string | string[] | undefined;
type Params = string;

export const tripNewPath = () => "/trips/new";
export const errorPath = () => "/error";
export const loginPath = () => "/login";
export const setupPath = () => "/users/setup";
export const homePath = () => "/";

export const tripPath = (tripId: SearchParam | number | null) => {
  if (Array.isArray(tripId) || tripId === undefined || tripId === null) {
    // TODO o11y
    console.error(`tripPath: tripId is invalid ${tripId}`);
    return errorPath();
  }

  return `/trips/${tripId}`;
};

export const routePath = (tripId: number | null, routeId: number) =>
  `${tripPath(tripId)}/routes/${routeId}`;

export const planPath = (tripId: SearchParam) => `${tripPath(tripId)}/plan`;

export const newTripPath = (tripId: Params) => `${tripPath(tripId)}/routes/new`;
