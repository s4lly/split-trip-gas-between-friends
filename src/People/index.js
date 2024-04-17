import { useContext } from "react";
import { Context } from "../Context";

import List from "./List";
import Input from "./Input";

// START READ INPUT LIST
const People = () => {
  const {
    state: {
      vertices: { people: vertex },
    },
  } = useContext(Context);

  return (
    <>
      <h2>People</h2>
      {(vertex === "START" || vertex === "LIST") && <List />}
      {(vertex === "READ" || vertex === "CREATE" || vertex === "EDIT") && <Input />}
    </>
  );
};

export default People;
