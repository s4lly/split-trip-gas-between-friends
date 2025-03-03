import { useContext } from "react";
import { Context } from "../components/Context";

import CarDisplay from "./Display";
import CarInput from "./Input";
import CarSelect from "./Select";

const Car = () => {
  const {
    state: {
      vertices: { car: vertex },
    },
  } = useContext(Context);

  return (
    <>
      <h2>Car</h2>
      {(vertex === "START" || vertex === "READ") && <CarDisplay />}
      {vertex === "SELECT" && <CarSelect />}
      {vertex === "CREATE" && <CarInput />}
    </>
  );
};

export default Car;
