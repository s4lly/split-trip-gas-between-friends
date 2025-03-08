import { createClient } from "@/utils/supabase/server";
import { StateProvider } from "@/components/Context";

import MyTrips from "@/components/MyTrips/MyTrips";
import { getTrips } from "./actions";

// import Car from "./Car";
// import People from "./People";
// import Search from "./Route";
// import Stops from "./Route/Stops";
// import GMap from "./Route/Map";

export default async function Home() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  const isUserLoggedIn = auth?.user;

  const trips = getTrips();

  return (
    <StateProvider>
      <div className="content">
        <div className="app">
          {isUserLoggedIn && <MyTrips trips={trips} />}

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
