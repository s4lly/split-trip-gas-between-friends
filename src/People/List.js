import { useContext } from "react";
import { styled } from '@stitches/react'

import { Context } from "../Context";
import ScrollableContaier from "../Shared/ScrollableContainer";

const PeopleContainer = styled("div", {
  width: "400px",
  "> div": {
    marginBottom: "10px",
  },
})

const PeopleDisplayControls = styled("div", {
  display: "flex",
  justifyContent: "space-between",
})

const Display = () => {
  const {
    state: {
      vertices: { people: vertex },
      people,
    },
    dispatch,
  } = useContext(Context);

  const handlePeopleSelector = (id) => {
    dispatch({
      type: "people:select",
      payload: { personId: id },
    });

    dispatch({
      type: "transition:state",
      payload: { vertex: { people: "EDIT" } },
    });
  };

  const handleAddAnotherPerson = () => {
    dispatch({
      type: "transition:state",
      payload: { vertex: { people: "CREATE" } },
    });
  }

  let content
  switch (vertex) {
    case "START":
    case "READ":
      content = (
        <ScrollableContaier>
          <div>
            {people.map((person) => (
              <div
                onClick={() => handlePeopleSelector(person.id)}
                key={person.id}
              >
                {person.name}
              </div>
            ))}
          </div>
        </ScrollableContaier>
      )
      break;

    default:
      throw new Error(`People/List -  unsupported vertex: ${vertex}`)
  }

    const controls = ((vertex === "START" || vertex === "READ")
    ? (
      // controls UI: read
      <>
        <div>
          <label>number of saved people: {people.length}</label>
        </div>
        <div>
          <button onClick={handleAddAnotherPerson}>add another person</button>
        </div>
      </>
    )
    : (
      <p>select</p>
    )
    )

  return (
    <PeopleContainer>
      {content}

      <PeopleDisplayControls>
        {controls}
      </PeopleDisplayControls>
    </PeopleContainer>
  );
};

export default Display;
