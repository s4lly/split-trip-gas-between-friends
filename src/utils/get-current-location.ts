import { LatLng } from "@/features/trip/components/destination/map-state-provider";

export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      maximumAge: 5 * 60 * 1_000,
    });
  });
};

export const getCurrentLocationAsLatLng = async (): Promise<LatLng> => {
  const position = await getCurrentLocation();

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
};
