import { Button } from "@/components/ui/button"
import StateProvider from './Context'

import Car from './Car'
import People from './People'
import Search from './Route'
import Stops from './Route/Stops'
import GMap from "./Route/Map"

const App = () => {
  return (
    <div className="content">
    <StateProvider>
      <div className="App">
        <Button>Click me</Button>

        <h1>Trip: weekend in San Francisco</h1>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>

        <People />

        <Car />

        <div>
          <h1>route</h1>

          <Search />

          <Stops />

        </div>

        <div>
          <h1>map</h1>

          <GMap />
        </div>

        {/* <div>
          <h1>calculation</h1>
        </div> */}
      </div>
    </StateProvider>
    </div>
  );
};

export default App;
