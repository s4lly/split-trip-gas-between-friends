import { useReducer, createContext, useContext, useState } from 'react'

import * as Label from "@radix-ui/react-label"

import { Context, CarContainer, CarInputControls, Foo1, Foo2, Foo3 } from './App'

const CarInput = () => {
    const [name, setName] = useState("")
    const [mpg, setMpg] = useState("")
  
    const { state, dispatch } = useContext(Context)
  
    const handleChangeName = (e) => {
      setName(e.target.value)
    }
  
    const handleChangeMpg = (e) => {
      const mpg = parseInt(e.target.value, 10)
  
      if (isNaN(mpg)) { return }
  
      setMpg(mpg)
    }
  
    const handleCancel = () => {
      // button only visible when have at least one car so ok to go to READ
      dispatch({ type: "transition:state", payload: { vertex: "READ" } })
    }
  
    const handleCreate = () => {
      dispatch({ type: "car:create", payload: { name, mpg } })
    }
  
    return (
      <CarContainer>
        <Foo1>
          <Foo2>
            <Label.Root htmlFor="name">
              name:
            </Label.Root>
            <Foo3 type="text" id="name" value={name} onChange={handleChangeName}></Foo3>
          </Foo2>
  
          <Foo2>
            <Label.Root htmlFor="mpg">
              mpg:
            </Label.Root>
            <Foo3 type="number" id="mpg" value={mpg} onChange={handleChangeMpg}></Foo3>
          </Foo2>
        </Foo1>
  
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
      </CarContainer>
    )
  }

  export default CarInput