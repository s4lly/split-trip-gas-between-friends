type SearchParam = string | string[] | undefined;
type Param = string;

export const tripNewPath = () => "/trips/new";
export const errorPath = () => "/error";
export const loginPath = () => "/login";
export const setupPath = () => "/users/setup";
export const homePath = () => "/";
export const profilePath = (profileId: Param) => `/users/${profileId}`;

export const tripsPath = () => "/trips";
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

export const newDestinationPath = (tripId: Param) =>
  `${tripPath(tripId)}/destinations/new`;

export const overviewPath = (tripId: Param) => `${tripPath(tripId)}/overview`;

export const sharePath = (tripId: Param) => `${tripPath(tripId)}/share`;
export const joinPath = (searchParams: URLSearchParams) =>
  `${tripsPath()}/join?${searchParams.toString()}`;
