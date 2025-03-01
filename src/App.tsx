import StateProvider from "./Context";
import supabase from "./utils/supabase";

import Car from "./Car";
import People from "./People";
import Search from "./Route";
import Stops from "./Route/Stops";
import GMap from "./Route/Map";

import "./App.css";
import { useEffect, useState } from "react";

interface Trip {
  created_at: string;
  id: number;
  name: string;
}

const App = () => {
  // const [trips, setTrips] = useState<Trip[]>([]);

  // useEffect(() => {
  //   const getTrips = async () => {
  //     const { data: trips } = await supabase.from("trips").select();

  //     if (trips?.length) {
  //       setTrips(trips);
  //     }
  //   };

  //   getTrips();
  // }, []);

  return (
    <div className="content">
      <StateProvider>
        <div className="app">
          {/* <h1>Trip: weekend in San Francisco</h1> */}
          {/* <div>
            <h2>Trips</h2>

            {trips.map((trip) => (
              <div key={trip.id}>{trip.name}</div>
            ))}
          </div> */}

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
