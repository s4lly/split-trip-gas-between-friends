import { useContext } from "react";
import { Context } from "../Context";

const Stops = () => {
  const { state } = useContext(Context);
console.log(">>>> Stops: ", state.stops)

  return (
    <div>
      <h2>stops</h2>

      {state.stops.length > 0 && (
        <ul>
          {state.stops.map((stop) => {
            return <li>{stop.name}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

export default Stops;
