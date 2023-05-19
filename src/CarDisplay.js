import { useContext, useState } from 'react'

import * as Label from "@radix-ui/react-label"
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { styled } from '@stitches/react'

import { Context, CarContainer, Foo11, Foo2, Foo3 } from './App'

import './CarDisplay.css'

// ----

export const CarDisplayControls = styled("div", {
  display: "flex",
  justifyContent: "space-between"
})

const ScrollAreaRoot = styled(ScrollArea.Root, {
  border: "1px solid black",
  height: 125,
  borderRadius: 4,
  overflow: 'hidden',
  backgroundColor: 'white',
})

const CarDisplay = () => {
  // global state transition: READ
  // local transition states: SELECT

  const { state, dispatch } = useContext(Context)
  const [vertex, setVertex] = useState(state.vertex)

  const selectedCar = state.cars.find(car => car.id === state.selectedCarId)

  const handleUIChangeToSelect = () => {
    setVertex("SELECT")
  }

  const handleCancelSelect = () => {
    setVertex("READ")
  }

  const handleAddAnotherCar = () => {
    dispatch({ type: "transition:state", payload: { vertex: "CREATE" } })
  }

  const handleSelectCar = (carId) => {
    dispatch({ type: "car:select", payload: { carId } })
    setVertex("READ")
  }

  const content = (
    vertex === "READ" ? (
      <Foo11>
        <Foo2>
          <Label.Root htmlFor="name">
            name:
          </Label.Root>
          <Foo3 type="text" id="name" disabled value={selectedCar.name}></Foo3>
        </Foo2>

        <Foo2>
          <Label.Root htmlFor="mpg">
            mpg:
          </Label.Root>
          <Foo3 type="number" id="mpg" value={selectedCar.mpg} disabled></Foo3>
        </Foo2>
      </Foo11>
    ) : (
      <ScrollAreaRoot>
        <ScrollArea.Viewport className='ScrollAreaViewport'>
          <div>
            {state.cars.map(car => (
              <div onClick={() => handleSelectCar(car.id)} key={car.id}>{car.name}</div>
            ))}
          </div>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar className='ScrollAreaScrollbar' orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>

        <ScrollArea.Scrollbar className='ScrollAreaScrollbar' orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner />
      </ScrollAreaRoot>
    )
  )

  const controls = (
    vertex === "READ" ? (
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
      <>
        <div>
          <label>number of saved cars: {state.cars.length}</label>
        </div>
        <div>
          <button onClick={handleCancelSelect}>cancel</button>
        </div>
      </>
    )
  )

  return (
    <CarContainer>
      {content}

      <CarDisplayControls>
        {controls}
      </CarDisplayControls>
    </CarContainer>
  )
}

export default CarDisplay