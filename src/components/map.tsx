"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import useMapStateContext from "@/features/trip/hooks/useMapStateContext";
import { MapGraph } from "@/features/trip/types";
import { MapGraphNodes } from "@/features/trip/utils";
import { errorPath } from "@/paths";
import { getCurrentLocationAsLatLng } from "@/utils/get-current-location";

type MapProps = {
  mapGraph: MapGraph | null;
};

type GeometryLibrary = google.maps.GeometryLibrary;
type MarkerLibrary = google.maps.MarkerLibrary;

type Polyline = google.maps.Polyline;
type AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

function buildContent(
  label: string,
  options?: { color?: string; background?: string },
) {
  const color = options?.color ?? "#4285F4";
  const background = options?.background ?? "#fff";

  const htmlString = ReactDOMServer.renderToStaticMarkup(
    <span className="inline-block align-middle">
      <svg
        width="40"
        height="48"
        viewBox="0 0 40 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow"
      >
        {/* Pin shape */}
        <path
          d="M20 47C20 47 36 31.5 36 20C36 10.6112 28.3888 3 19.9999 3C11.6112 3 4 10.6112 4 20C4 31.5 20 47 20 47Z"
          fill={background}
          stroke={color}
          strokeWidth="2"
        />
        {/* Label */}
        <text
          x="20"
          y="20"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={color}
          fontFamily="sans-serif"
          dominantBaseline="middle"
        >
          {label}
        </text>
      </svg>
    </span>,
  );

  // Need a DOM node for Google Maps, so we create a wrapper div, set innerHTML, and return the first child
  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlString;
  return wrapper.firstChild as HTMLElement;
}

// TODO consider passing location through props so can save to trip and use same as current destinations

export const Map = ({ mapGraph }: MapProps) => {
  const { state: mapState, dispatch: mapStateDispatch } = useMapStateContext();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    isMapLoaded: false,
    isItemsRenderedOnce: false,
  });

  const [polylines, setPolylines] = useState<Polyline[]>([]);
  const [markers, setMarkers] = useState<AdvancedMarkerElement[]>([]);

  useEffect(() => {
    const initializeMap = async () => {
      const position = mapState.center ?? (await getCurrentLocationAsLatLng());

      const mapOptions = {
        center: position,
        zoom: 8,
        mapId: process.env.NEXT_PUBLIC_MAIN_MAP_ID as string,
        disableDefaultUI: true,
        keyboardShortcuts: true,
      };

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        version: "weekly",
      });

      loader
        .importLibrary("maps")
        .then(({ Map }) => {
          if (!mapRef.current) {
            console.error("cannot find element to attach map");
            redirect(errorPath());
          }

          const map = new Map(mapRef.current, mapOptions);

          map.addListener("center_changed", () => {
            const center = map.getCenter();

            if (center == null) {
              return;
            }

            mapStateDispatch({
              type: "SET_CENTER",
              payload: {
                lat: center.lat(),
                lng: center.lng(),
              },
            });
          });

          setMap(map);
          setState((prev) => ({ ...prev, isMapLoaded: true }));
        })
        .catch((error) => {
          console.error("error loading maps library: ", error);
          redirect(errorPath());
        });
    };

    initializeMap();
  }, []);

  // create polylines and markers
  useEffect(() => {
    const addItemsToMap = async () => {
      if (map == null || mapGraph == null) {
        return;
      }

      const { encoding } = (await google.maps.importLibrary(
        "geometry",
      )) as GeometryLibrary;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker",
      )) as MarkerLibrary;

      const newPolylines: Polyline[] = [];
      const newMarkers: AdvancedMarkerElement[] = [];

      if (mapGraph.size) {
        setState((prev) => ({ ...prev, isItemsRenderedOnce: true }));
      }

      for (const tripNode of MapGraphNodes(mapGraph)) {
        // add polyline
        if (tripNode.type === "trip" && tripNode.route) {
          const decodedPath = encoding.decodePath(
            tripNode.route.polyline.encodedPolyline,
          );

          const polyline = new google.maps.Polyline({
            path: decodedPath,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 3,
          });

          polyline.setMap(map);
          newPolylines.push(polyline);
        }

        // add marker
        const advancedMarkerElementOptions: google.maps.marker.AdvancedMarkerElementOptions =
          {
            map,
            position: {
              lat: tripNode.coordinates.latitude,
              lng: tripNode.coordinates.longitude,
            },
          };

        if (tripNode.type === "suggestion") {
          advancedMarkerElementOptions.content = buildContent(tripNode.label);
        }

        const marker = new AdvancedMarkerElement(advancedMarkerElementOptions);
        newMarkers.push(marker);
      }

      setPolylines(newPolylines);
      setMarkers(newMarkers);
    };

    addItemsToMap();
  }, [map, mapGraph]);

  useEffect(() => {
    if (map === null || !state.isMapLoaded) {
      return;
    }

    const cleanupItemsFromMap = async () => {
      if (markers.length === 0) {
        map.setZoom(10);
      } else if (markers.length === 1 && markers[0].position) {
        map.setCenter(markers[0].position);
        map.setZoom(14);
      } else if (markers.length > 1) {
        const bounds = new google.maps.LatLngBounds();

        markers.forEach((marker) => {
          if (marker.position) {
            bounds.extend(marker.position);
          }
        });

        map.fitBounds(bounds);
      }
    };

    if (state.isItemsRenderedOnce) {
      cleanupItemsFromMap();
    }

    return () => {
      polylines.forEach((polyline) => {
        polyline.setMap(null);
      });

      markers.forEach((marker) => {
        marker.map = null;
      });
    };
  }, [state, map, polylines, markers]);

  return (
    <div className="h-full w-full" ref={mapRef}>
      <p>Loading...</p>
    </div>
  );
};
