import { createClient } from "@/utils/supabase/server";
import { StateProvider } from "@/components/Context";

import { getTrips } from "./actions";
import { Suspense } from "react";
import Link from "next/link";

import classes from "@/app/page.module.css";
import MyTrips from "@/components/MyTrips/MyTrips";

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
          {isUserLoggedIn && (
            <div>
              <div className={classes.tripsHeader}>
                <h2>My Trips</h2>
                <Link href="/trips/new">new</Link>
              </div>
              <Suspense fallback={<div>Loading...</div>}>
                <MyTrips trips={trips} />
              </Suspense>
            </div>
          )}

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
