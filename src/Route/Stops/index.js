import { useContext } from "react";
import { Context } from "../../Context";
import Stop from "./Stop";

const Container = ({ stops }) => {
  return (
    <div>
      {stops.map((stop) => {
        return <Stop stop={stop} />;
      })}
    </div>
  );
};

const Stops = () => {
  const { state } = useContext(Context);

  return (
    <div>
      <h2>stops</h2>

      {state.stops.length > 0 && <Container stops={state.stops} />}
    </div>
  );
};

export default Stops;
