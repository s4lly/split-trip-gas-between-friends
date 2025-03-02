import { createContext, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

const reducer = (state, action) => {
  console.log(state);
  console.log(action);

  let newState;

  switch (action.type) {
    // car
    case "car:create":
      const {
        payload: { name, mpg },
      } = action;
      const newCarId = uuidv4();

      newState = {
        ...state,
        cars: [...state.cars, { id: newCarId, name, mpg }],
        selectedCarId: newCarId,
        vertex: "READ",
      };

      break;

    case "car:select":
      const selectedCar = state.cars.find(
        (car) => car.id === action.payload.carId,
      );

      newState = {
        ...state,
        selectedCarId: selectedCar?.id ?? state.selectedCarId,
      };

      break;

    // ----

    // people

    case "people:create":
      const newPeopleId = uuidv4();

      newState = {
        ...state,
        selectedPersonId: newPeopleId,
        people: [...state.people, { id: newPeopleId, ...action.payload }],
      };

      break;

    case "people:select":
      const selectedPerson = state.people.find(
        (person) => person.id === action.payload.personId,
      );

      // TODO handle when can't find
      // TODO consider how to better "un select"
      newState = { ...state, selectedPersonId: selectedPerson?.id };

      break;

    case "people:edit":
      const { id: editedPersonId, ...restEdited } = action.payload;

      const editedPeople = state.people.map((person) => {
        if (person.id !== editedPersonId) {
          return person;
        }

        return { ...person, ...restEdited };
      });

      newState = { ...state, people: editedPeople };

      break;

    // ----

    // general
    case "transition:state":
      const {
        payload: { vertex },
      } = action;

      newState = { ...state, vertices: { ...state.vertices, ...vertex } };

      break;

    // ----

    // stops

    case "stops:list:add":
      // payload: { name: description, gMapsData: { place_id, lat, lng } },
      const { payload } = action;

      // persisted before disptach

      // add to state
      newState = { ...state, stops: [...state.stops, payload] };

      break;

    default:
      throw new Error();
  }

  return newState;
};

export const Context = createContext({ state: {}, dispatch: () => {} });

// ----

const initialState = {
  // car

  cars: [
    /*
      {
        id: string,
        name: string,
        mpg: number
      }
    */
    // { id: "1", name: "car 1", mpg: 11 },
    // { id: "2", name: "car 2", mpg: 12 },
    // { id: "3", name: "car 3", mpg: 13 },
    // { id: "4", name: "car 4", mpg: 14 },
    // { id: "5", name: "car 5", mpg: 15 },
    // { id: "6", name: "car 6", mpg: 16 },
    // { id: "7", name: "car 7", mpg: 17 },
    // { id: "8", name: "car 8", mpg: 18 },
  ],
  selectedCarId: undefined, //'1',

  // ----

  // people

  people: [
    /*
      {
        id: string,
        name: string,
        number: number,
        paymentApp: string
      }
    */
    { id: "1", name: "john", number: 555_555_5555, paymentApp: "zelle" },
    { id: "2", name: "jane", number: 444_444_4444, paymentApp: "venmo" },
  ],
  selectedPersonId: undefined,

  // ----

  // stops
  stops: [
    // {
    //   name: "",
    //   gMapsData: {},
    // }
  ],

  // ----

  // rest

  // START, CREATE, READ, SELECT
  // TODO is SELECT global or local? like do the other components need to know?
  vertex: "START",

  vertices: {
    // TODO: refactor, directory name should be plural/singular
    // pick one and use for all.
    // maybe consider also matching state, like it is using plural
    car: "START",
    people: "START",
  },
};

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export default Provider;
