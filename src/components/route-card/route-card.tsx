import { FC } from "react";

type RouteCardProps = {
  start: string | null;
  end: string | null;
};

const RouteCard: FC<RouteCardProps> = ({ start, end }) => {
  return (
    <li className="grid grid-cols-[1fr_3fr] w-full px-4 py-2 border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700">
      <div className="row-span-2">drag</div>
      <div>from: {start ?? "no start"}</div>
      <div>to: {end ?? "no end"}</div>
    </li>
  );
};

export default RouteCard;
