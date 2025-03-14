import { FC } from "react";
import classes from "./route-card.module.css";

type RouteCardProps = {
  start: string | null;
  end: string | null;
};

const RouteCard: FC<RouteCardProps> = ({ start, end }) => {
  return (
    <div className={classes.route}>
      <div>drag</div>
      <div>from: {start ?? "no start"}</div>
      <div>to: {end ?? "no end"}</div>
    </div>
  );
};

export default RouteCard;
