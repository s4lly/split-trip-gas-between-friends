import { useContext } from "react";

import * as Label from "@radix-ui/react-label";
import { styled } from "@stitches/react";

import { Context } from "../Context";
import ScrollableContaier from "../Shared/ScrollableContainer";
import { ResourceDetails, ResourceDetail, ResourceDetailInput } from "../Shared/ResourceDetails";

import "./Display.css";

// ----

const DisplayContainer = styled("div", {
  width: "400px",
  "> div": {
    marginBottom: "10px",
  },
})

const InputControlContainer = styled("div", {
  display: "flex",
  justifyContent: "space-between",
});

// state transitions: READ, SELECT
const CarDisplay = () => {
  const { state, dispatch } = useContext(Context);

  console.log("state: ", state.vertices.car)

  const selectedCar = state.cars.find((car) => car.id === state.selectedCarId);

  const handleUIChangeToSelect = () => {
    dispatch({
      type: "transition:state",
      payload: { vertex: { car: "SELECT" } },
    });
  };

  const handleCancelSelect = () => {
    dispatch({
      type: "transition:state",
      payload: { vertex: { car: "READ" } },
    });
  };

  const handleAddAnotherCar = () => {
    dispatch({
      type: "transition:state",
      payload: { vertex: { car: "CREATE" } },
    });
  };

  const handleSelectCar = (carId) => {
    dispatch({ type: "car:select", payload: { carId } });
    dispatch({
      type: "transition:state",
      payload: { vertex: { car: "READ" } },
    });
  };

  const content =
    state.vertices.car === "READ" ? (
      <ResourceDetails>
        <ResourceDetail>
          <Label.Root htmlFor="name">name:</Label.Root>
          <ResourceDetailInput type="text" id="name" disabled value={selectedCar.name}></ResourceDetailInput>
        </ResourceDetail>

        <ResourceDetail>
          <Label.Root htmlFor="mpg">mpg:</Label.Root>
          <ResourceDetailInput type="number" id="mpg" value={selectedCar.mpg} disabled></ResourceDetailInput>
        </ResourceDetail>
      </ResourceDetails>
    ) : (
      // controls UI: select
      // TODO move to own module
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

  const controls =
    state.vertices.car === "READ" ? (
      // controls UI: read
      <>
        <div>
          <label>number of saved cars: {state.cars.length}</label>
        </div>
        {state.cars.length > 0 && (
          <div>
            <button onClick={handleUIChangeToSelect}>select a car</button>
          </div>
        )}
        <div>
          <button onClick={handleAddAnotherCar}>add another car</button>
        </div>
      </>
    ) : (
      // controls UI: select
      // TODO move to own module
      <>
        <div>
          <label>number of saved cars: {state.cars.length}</label>
        </div>
        <div>
          <button onClick={handleCancelSelect}>cancel</button>
        </div>
      </>
    );

  return (
    <DisplayContainer>
      {content}

      <InputControlContainer>{controls}</InputControlContainer>
    </DisplayContainer>
  );
};

export default CarDisplay;
