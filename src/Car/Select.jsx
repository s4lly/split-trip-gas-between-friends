import { useContext } from "react";
import { styled } from "@stitches/react";

import { Context } from "../Context";

import ScrollableContaier from "../Shared/ScrollableContainer";
import { isBlank } from "../Shared";

const DisplayContainer = styled("div", {
  width: "400px",
  "> div": {
    marginBottom: "10px",
  },
});

const InputControlContainer = styled("div", {
  display: "flex",
  justifyContent: "space-between",
});

const Select = () => {
  const { state, dispatch } = useContext(Context);

  const handleCancelSelect = () => {
    dispatch({
      type: "transition:state",
      payload: { vertex: { car: "READ" } },
    });
  };

  const handleSelectCar = (carId) => {
    dispatch({ type: "car:select", payload: { carId } });
    dispatch({
      type: "transition:state",
      payload: { vertex: { car: "READ" } },
    });
  };

  const content = (
    <ScrollableContaier>
      <div>
        {state.cars.map((car) => (
          <div onClick={() => handleSelectCar(car.id)} key={car.id}>
            {car.name}
          </div>
        ))}
      </div>
    </ScrollableContaier>
  );

  const controls = (
    <>
      <div>
        <label>number of saved cars: {state.cars.length}</label>
      </div>
      {!isBlank(state.selectedCarId) && (
        <div>
          <button onClick={handleCancelSelect}>cancel</button>
        </div>
      )}
    </>
  );

  return (
    <DisplayContainer>
      {content}

      <InputControlContainer>{controls}</InputControlContainer>
    </DisplayContainer>
  );
};

export default Select;
