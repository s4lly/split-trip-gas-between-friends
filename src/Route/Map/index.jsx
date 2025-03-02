/* eslint-disable no-undef */
import { useContext, useEffect, useRef } from "react";
import { Context } from "../../Context";
import Gmap from "./Gmap";

const GMap = () => {
  const map = useRef();
  const mapElementRef = useRef();

  const {
    state: { stops },
  } = useContext(Context);

  useEffect(() => {
    const initMap = async () => {
      if (stops.length === 0) {
        return;
      }

      const [firstStop] = stops;

      if (!map.current) {
        map.current = await Gmap.create(
          mapElementRef.current,
          firstStop.gMapsData,
        );
      }

      await map.current.addMarkers(stops);
      map.current.fitBounds();
    };

    initMap();
  }, [stops.length]);

  return (
    <>
      {stops.length > 0 && (
        <div style={{ height: "400px" }} ref={mapElementRef}></div>
      )}
    </>
  );
};

export default GMap;
