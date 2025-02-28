import { useContext } from "react";
import { Context } from "../Context";
import ScrollableContaier from "../Shared/ScrollableContainer";
import classNames from "classnames";

import classes from "./List.module.css";

/*

<div
  className={classNames(
    classes.personListItemContainer,
    classes.personListItemContainerHeader
  )}
>
  <div>name</div>
  <div>phone</div>
  <div>payment app</div>
</div>
<div className={classes.listItemContainerBody}>
  {people.map((person) => (
    <div
      tabIndex={0}
      className={classes.personListItemContainer}
      onClick={() => handlePeopleSelector(person.id)}
      key={person.id}
    >
      <div>{person.name}</div>
      <div>{person.number}</div>
      <div>{person.paymentApp}</div>
    </div>
  ))}
</div>

*/

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
  };

  const handleDone = () => {
    dispatch({
      type: "transition:state",
      payload: { vertex: { people: "READ" } },
    });
  };

  let content;
  switch (vertex) {
    case "START":
    case "READ":
      content = (
        <div>
          <div>
            <label>number of saved people: {people.length}</label>
          </div>
          <table className={classes.listItemTable}>
            {/* header */}
            <thead>
              <tr>
                <th>name</th>
                <th>phone</th>
                <th>payment app</th>
              </tr>
            </thead>
            {/* body */}
            <tbody>
              {people.map((person) => (
                // row
                <tr
                  key={person.id}
                  tabIndex={0}
                  onClick={() => handlePeopleSelector(person.id)}
                >
                  <td>{person.name}</td>
                  <td>{person.number}</td>
                  <td>{person.paymentApp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      break;

    default:
      throw new Error(`People/List -  unsupported vertex: ${vertex}`);
  }

  const controls =
    vertex === "START" || vertex === "READ" ? (
      // controls UI: read
      <div className={classes.controlsContainer}>
        <div>
          <button onClick={handleDone}>return</button>
        </div>
        <div>
          <button onClick={handleAddAnotherPerson}>add</button>
        </div>
      </div>
    ) : (
      <p>select</p>
    );

  return (
    <div className={classes.container}>
      <h2>list</h2>

      {content}

      <div className={classes.controlsContainer}>{controls}</div>
    </div>
  );
};

export default Display;
