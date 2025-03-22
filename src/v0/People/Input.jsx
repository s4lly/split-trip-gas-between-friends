import { useContext, useState } from "react";
import { styled } from "@stitches/react";

import { Context } from "../components/Context";
import { getStringOrEmpty } from "../Shared";
import {
  ResourceDetails,
  ResourceDetail,
  ResourceDetailInput,
} from "../Shared/ResourceDetails";

import "./people.css";

export const InputContainer = styled("div", {
  width: "100%",
  "> div": {
    marginBottom: "10px",
  },
});

const InputControlContainer = styled("div", {
  display: "flex",
  justifyContent: "space-between",
});

const Input = () => {
  const {
    state: {
      vertices: { people: vertex },
      selectedPersonId,
      people,
    },
    dispatch,
  } = useContext(Context);

  const selectedPerson = people.find(
    (person) => person.id === selectedPersonId
  );

  const [name, setName] = useState(() => selectedPerson?.name ?? "");
  const [number, setNumber] = useState(() => selectedPerson?.number ?? "");
  const [paymentApp, setPaymentApp] = useState(
    () => selectedPerson?.paymentApp ?? ""
  );

  const handleChangeName = (e) => {
    setName(getStringOrEmpty(e?.target?.value));
  };

  const handleChangeNumber = (e) => {
    const number = parseInt(e.target?.value, 10);

    if (Number.isNaN(number)) {
      return;
    }

    setNumber(number);
  };

  const handleChangePaymentApp = (e) => {
    setPaymentApp(getStringOrEmpty(e.target?.value));
  };

  const handleCreate = () => {
    dispatch({
      type: "people:create",
      payload: { name, number, paymentApp },
    });
    dispatch({
      type: "transition:state",
      payload: { vertex: { people: "READ" } },
    });
  };

  const handleEdit = () => {
    dispatch({
      type: "people:edit",
      payload: { name, number, paymentApp },
    });
    dispatch({
      type: "people:select",
      payload: { personId: selectedPersonId },
    });
    dispatch({
      type: "transition:state",
      payload: { vertex: { people: "START" } },
    });
  };

  const content = (
    <div className="input-group-container">
      <div className="input-group">
        <label htmlFor="name">name:</label>
        <input
          className="input-box"
          disabled={vertex === "READ"}
          type="text"
          id="name"
          value={name}
          onChange={handleChangeName}
        />
      </div>

      <div className="input-group">
        <label htmlFor="number">number:</label>
        <input
          className="input-box"
          disabled={vertex === "READ"}
          type="tel"
          id="number"
          value={number}
          onChange={handleChangeNumber}
        />
      </div>

      <div className="input-group">
        <label htmlFor="payment-app">payment app:</label>
        <input
          className="input-box"
          disabled={vertex === "READ"}
          type="text"
          id="payment-app"
          value={paymentApp}
          onChange={handleChangePaymentApp}
        />
      </div>
    </div>
  );

  const handleGoBack = () => {
    dispatch({
      type: "transition:state",
      payload: { vertex: { people: "START" } },
    });
  };
  const handleGoEdit = () => {};

  const handleCancelCreate = () => {
    // TODO consider saving prev, otherwise just go back to start
    dispatch({
      type: "transition:state",
      payload: { vertex: { people: "START" } },
    });
  };
  const handleCancelEdit = () => {
    // TODO consider saving prev, otherwise just go back to start
    dispatch({
      type: "people:select",
      payload: { personId: undefined },
    });
    dispatch({
      type: "transition:state",
      payload: { vertex: { people: "START" } },
    });
  };

  let controls;
  switch (vertex) {
    case "READ":
      controls = (
        <>
          <div>
            <button onClick={handleGoEdit}>edit</button>
          </div>
          <div>
            <button onClick={handleGoBack}>go back</button>
          </div>
        </>
      );
      break;

    case "CREATE":
      controls = (
        <>
          {people.length > 0 && (
            <div>
              <button
                className="bg-gray-100 rounded"
                onClick={handleCancelCreate}
              >
                cancel
              </button>
            </div>
          )}
          <div>
            <button onClick={handleCreate}>save</button>
          </div>
        </>
      );
      break;

    case "EDIT":
      controls = (
        <>
          <div>
            <button onClick={handleCancelEdit}>cancel</button>
          </div>
          <div>
            <button onClick={handleEdit}>save</button>
          </div>
        </>
      );
      break;

    default:
      throw new Error(
        `People/Input - controls - cannot apply controls for vertex: ${vertex}`
      );
  }

  return (
    <InputContainer>
      {content}

      <InputControlContainer>{controls}</InputControlContainer>
    </InputContainer>
  );
};

export default Input;
