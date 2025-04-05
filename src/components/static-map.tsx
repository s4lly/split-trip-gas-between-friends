import { Location } from "@/utils/valibot/place-details-schema";

export const StaticMap = ({ coordinate }: { coordinate: Location }) => {
  const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
  const urlSearchParams = new URLSearchParams({
    center: `${coordinate.latitude},${coordinate.longitude}`,
    zoom: "13",
    size: "400x150",
    markers: `color:blue%7Clabel:S%7C${coordinate.latitude},${coordinate.longitude}`,
    key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
  });

  url.search = urlSearchParams.toString();
  const mapUrl = url.toString();

  return (
    <div className="max-h-[150px] w-full">
      <img src={mapUrl} alt="map"></img>
    </div>
  );
};

export default StaticMap;
