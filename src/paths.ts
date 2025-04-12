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

export const destinationPath = (tripId: number | null, destinationId: number) =>
  `${tripPath(tripId)}/destinations/${destinationId}`;

export const planPath = (tripId: SearchParam) => `${tripPath(tripId)}/plan`;

export const newDestinationPath = (tripId: Params) =>
  `${tripPath(tripId)}/destinations/new`;
