"use client";

import { createContext, useEffect, useReducer } from "react";
import { getCurrentLocation } from "@/utils/get-current-location";

// https://developers.google.com/maps/documentation/javascript/reference/map#LatLngLiteral
export type LatLng = {
  lat: number;
  lng: number;
};

type UpdateCenter = {
  type: "SET_CENTER";
  payload: LatLng | undefined;
};
type Actions = UpdateCenter;

type MapState = {
  center: LatLng | null;
};

const reducer = (state: MapState, action: Actions) => {
  switch (action.type) {
    case "SET_CENTER":
      return { ...state, center: action.payload ?? null };
  }
};

type MapStateContextType = {
  state: MapState;
  dispatch: (action: Actions) => void;
};

export const MapStateContext = createContext<MapStateContextType>({
  state: {
    center: null,
  },
  dispatch: () => {},
});

export const MapStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    center: null,
  });

  useEffect(() => {
    getCurrentLocation().then((position) => {
      dispatch({
        type: "SET_CENTER",
        payload: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      });
    });
  }, []);

  return (
    <MapStateContext value={{ state, dispatch }}>{children}</MapStateContext>
  );
};
