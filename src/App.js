import { useReducer, createContext } from 'react'
import { styled } from '@stitches/react'
import { v4 as uuidv4 } from 'uuid'

import CarInput from './Car/Input'
import CarDisplay from './Car/Display'

import PeopleDisplay from './People/Display'
import PeopleInput from './People/Input'

import Search from './Search'

// ----

const reducer = (state, action) => {
  let newState

  switch(action.type) {
    case "car:create":
      const { payload: { name, mpg } } = action
      const newCarId = uuidv4()

      newState = {
        ...state,
        cars: [...state.cars, { id: newCarId, name, mpg }],
        selectedCarId: newCarId,
        vertex: "READ"
      }

      break

    case 'car:select':
      const selectedCar = state.cars.find(car => car.id === action.payload.carId)

      newState = { ...state, selectedCarId: selectedCar?.id ?? state.selectedCarId }

      break

    case "transition:state":
      const { payload: { vertex } } = action

      newState = { ...state, vertex }

      break

    default:
      throw new Error()
  }

  return newState
}

export const Context = createContext({ state: {}, dispatch: () => { } })

const initialState = {
  // car
  cars: [
    // { id: string, name: string, mpg: number }
    { id: "1", name: "car 1", mpg: 11 },
    { id: "2", name: "car 2", mpg: 12 },
    { id: "3", name: "car 3", mpg: 13 },
    { id: "4", name: "car 4", mpg: 14 },
    { id: "5", name: "car 5", mpg: 15 },
    { id: "6", name: "car 6", mpg: 16 },
    { id: "7", name: "car 7", mpg: 17 },
    { id: "8", name: "car 8", mpg: 18 },
  ],
  // selectedCarId: '',
  selectedCarId: '1',
  // "car:transition:state": CAR_TRANSITION.START,

  // START, CREATE, READ, SELECT
  // TODO is SELECT global or local? like do the other components need to know?
  vertex: "START",
}

// ----

export const Foo1 = styled('div', {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
})

export const Foo11 = styled(Foo1, {
  border: "1px solid black",
  padding: "10px"
})

export const Foo2 = styled('div', {
  display: "flex",
  justifyContent: "space-between",
})

export const Foo3 = styled('input', {
  width: "75%",
})

export const CarContainer = styled("div", {
  width: "400px",
  "> div": {
    marginBottom: "10px",
  },
})

export const CarInputControls = styled("div", {
  display: "flex",
  justifyContent: "end",
  gap: "10px",
})

// ----

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Context.Provider value={{ state, dispatch }}>
      <div className="App">
        <div>
          <h1>car</h1>

          {state.vertex === "READ" ? <CarDisplay /> : <CarInput />}
        </div>

        <div>
          <h1>people</h1>

          {state.vertex === "READ" ? <PeopleDisplay /> : <PeopleInput />}
        </div>

        <div>
          <h1>route</h1>
          <Search />
        </div>

        <div>
          <h1>map</h1>
        </div>

        <div>
          <h1>calculation</h1>
        </div>
      </div>
    </Context.Provider>
  );
}

export default App;
