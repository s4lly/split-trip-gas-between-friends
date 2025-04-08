import Image from "next/image";
import { sign } from "@/features/trip/actions/sign-static-maps";
import { Location } from "@/utils/valibot/place-details-schema";

export const StaticMap = async ({
  coordinate,
  height = 150,
  width = 400,
}: {
  coordinate: Location;
  height?: number;
  width?: number;
}) => {
  const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
  const urlSearchParams = new URLSearchParams({
    center: `${coordinate.latitude},${coordinate.longitude}`,
    zoom: "13",
    size: `${width}x${height}`,
    markers: `${coordinate.latitude},${coordinate.longitude}`,
    key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
  });

  const hashedSignature = await sign(
    `${url.pathname}?${urlSearchParams.toString()}`,
  );

  urlSearchParams.append("signature", hashedSignature);

  url.search = urlSearchParams.toString();
  const mapUrl = url.toString();

  return (
    <div className="max-h-[150px] w-full">
      <Image height={height} width={width} src={mapUrl} alt="map" />
    </div>
  );
};

export default StaticMap;
