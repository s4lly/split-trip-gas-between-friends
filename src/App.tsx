import StateProvider from './Context'

import Car from './Car'
import People from './People'
import Search from './Route'
import Stops from './Route/Stops'
import GMap from "./Route/Map"

import './App.css'

const App = () => {
  return (
    <div className="content">
    <StateProvider>
      <div className="app">
        {/* <h1>Trip: weekend in San Francisco</h1> */}

        <People />

        {/* <Car /> */}

        {/* <div>
          <h1>route</h1>

          <Search />

          <Stops />

        </div> */}

        {/* <div>
          <h1>map</h1>

          <GMap />
        </div> */}

        {/* <div>
          <h1>calculation</h1>
        </div> */}
      </div>
    </StateProvider>
    </div>
  );
};

export default App;
