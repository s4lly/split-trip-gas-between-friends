import { useContext } from 'react'
import { styled } from '@stitches/react'
import StateProvider, { Context } from './Context'

import Car from './Car'
import People from './People'
import Search from './Search'

export const Foo1 = styled('div', {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
})

// ----

const App = () => {
  const { state } = useContext(Context)
  console.log("app state: ", state)

  return (
    <StateProvider>
      <div className="App">
        <Car />

        <People />

        {/* <div>
          <h1>route</h1>
          <Search />
        </div>

        <div>
          <h1>map</h1>
        </div>

        <div>
          <h1>calculation</h1>
        </div> */}
      </div>
    </StateProvider>
  );
}

export default App;
