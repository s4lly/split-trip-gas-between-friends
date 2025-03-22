"use client";

import { GoogleMap } from "@react-google-maps/api";

export const defaultMapContainerStyle = {
  width: "200px",
  height: "200px",
};

//K2's coordinates
const defaultMapCenter = {
  lat: 35.8799866,
  lng: 76.5048004,
};

//Default zoom level, can be adjusted
const defaultMapZoom = 18;

//Map options
const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeId: "satellite",
};

export const Map = () => {
  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
      ></GoogleMap>
    </div>
  );
};
