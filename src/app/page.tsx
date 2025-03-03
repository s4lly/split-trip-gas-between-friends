import { StateProvider } from "@/components/Context";
// import supabase from "./utils/supabase";

// import Car from "./Car";
// import People from "./People";
// import Search from "./Route";
// import Stops from "./Route/Stops";
// import GMap from "./Route/Map";

// import { useEffect, useState } from "react";

interface Trip {
  created_at: string;
  id: number;
  name: string;
}

export default function Home() {
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
    <StateProvider>
      <div className="content">
        <div className="app">
          <h1>Split Trip Gas Between Friends</h1>

          <div>
            <h2>My Trips</h2>

            {/* {trips.map((trip) => (
              <div key={trip.id}>{trip.name}</div>
            ))} */}
          </div>

          {/* <People /> */}

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
      </div>
    </StateProvider>
  );
}
