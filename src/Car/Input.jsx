import { useContext, useState } from "react";
import { styled } from "@stitches/react";
// import * as Label from "@radix-ui/react-label"

import { CarInputControls } from "./CarInputControls";
import { Context } from "../components/Context";
import {
  ResourceDetail,
  ResourceDetails,
  ResourceDetailInput,
} from "../Shared/ResourceDetails";

const InputContainer = styled("div", {
  width: "400px",
  "> div": {
    marginBottom: "10px",
  },
});

const CarInput = () => {
  const [name, setName] = useState("");
  const [mpg, setMpg] = useState("");

  const { state, dispatch } = useContext(Context);

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeMpg = (e) => {
    const mpg = parseInt(e.target.value, 10);

    if (isNaN(mpg)) {
      return;
    }

    setMpg(mpg);
  };

  const handleCancel = () => {
    // button only visible when have at least one car so ok to go to READ
    dispatch({
      type: "transition:state",
      payload: { vertex: { car: "READ" } },
    });
  };

  const handleCreate = () => {
    dispatch({ type: "car:create", payload: { name, mpg } });
    dispatch({
      type: "transition:state",
      payload: { vertex: { car: "READ" } },
    });
  };

  return (
    <InputContainer>
      <ResourceDetails>
        <ResourceDetail>
          {/* <Label.Root htmlFor="name">
              name:
            </Label.Root> */}
          <ResourceDetailInput
            type="text"
            id="name"
            value={name}
            onChange={handleChangeName}
          ></ResourceDetailInput>
        </ResourceDetail>

        <ResourceDetail>
          {/* <Label.Root htmlFor="mpg">
              mpg:
            </Label.Root> */}
          <ResourceDetailInput
            type="number"
            id="mpg"
            value={mpg}
            onChange={handleChangeMpg}
          ></ResourceDetailInput>
        </ResourceDetail>
      </ResourceDetails>

      <CarInputControls>
        {state.cars.length > 0 && (
          <div>
            <button onClick={handleCancel}>cancel</button>
          </div>
        )}
        <div>
          <button onClick={handleCreate}>submit</button>
        </div>
      </CarInputControls>
    </InputContainer>
  );
};

export default CarInput;
