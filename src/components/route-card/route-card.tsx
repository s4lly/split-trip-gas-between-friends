import { FC } from "react";
import classes from "./route-card.module.css";

type RouteCardProps = {
  start: string;
  end: string;
};

const RouteCard: FC<RouteCardProps> = ({ start, end }) => {
  return (
    <div className={classes.route}>
      <div>drag</div>
      <div>from: {start}</div>
      <div>to: {end}</div>
    </div>
  );
};

export default RouteCard;
