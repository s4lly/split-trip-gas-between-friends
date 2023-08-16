import { useContext } from "react";
import { Context } from "../Context";

import CarDisplay from "./Display";
import CarInput from "./Input";

const Car = () => {
  const {
    state: {
      vertices: { car: vertex },
    },
  } = useContext(Context);

  return (
    <>
      <h2>car</h2>
      {(vertex === "START" || vertex === "READ" || vertex === "SELECT") && <CarDisplay />}
      {vertex === "CREATE" && <CarInput />}
    </>
  );
};

export default Car;
