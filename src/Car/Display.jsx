import { useContext } from "react";
import { styled } from "@stitches/react";
import * as Label from "@radix-ui/react-label";

import { Context } from "../Context";
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

const CarDisplay = () => {
  const { state, dispatch } = useContext(Context);

  console.log("car state: ", state.vertices.car)

  const selectedCar = state.cars.find((car) => car.id === state.selectedCarId);

  if (!selectedCar) {
    if (state.cars.length === 0) {
      dispatch({
        type: "transition:state",
        payload: { vertex: { car: "CREATE" } }
      })
    }
    else {
      dispatch({
        type: "transition:state",
        payload: { vertex: { car: "SELECT" } }
      })
    }

    return <></>
  }

  const handleUIChangeToSelect = () => {
    dispatch({
      type: "transition:state",
      payload: { vertex: { car: "SELECT" } },
    });
  };

  const handleAddAnotherCar = () => {
    dispatch({
      type: "transition:state",
      payload: { vertex: { car: "CREATE" } },
    });
  };

  const content = (
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
  );

  const controls = (
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
  );

  return (
    <DisplayContainer>
      {content}

      <InputControlContainer>{controls}</InputControlContainer>
    </DisplayContainer>
  );
};

export default CarDisplay;
