import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import { Database } from "@/utils/supabase/database.types";
type Trip = Database["public"]["Tables"]["trips"]["Row"];

import { StateProvider } from "@/components/Context";
import classes from "@/app/page.module.css";
import Link from "next/link";

// import Car from "./Car";
// import People from "./People";
// import Search from "./Route";
// import Stops from "./Route/Stops";
// import GMap from "./Route/Map";

// import { useEffect, useState } from "react";

export default async function Home() {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();

  if (error) {
    // TODO can get here if user is not logged in
    console.log(error);
  }

  let trips: Trip[] = [];
  const isUserLoggedIn = auth?.user;

  if (isUserLoggedIn) {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("user", auth.user.id);

    if (error) {
      redirect("/error");
    }

    trips = data;
  }

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

              <div>
                {trips.length > 0 && (
                  <ul>
                    {trips.map((trip) => (
                      <li key={trip.id}>{trip.name}</li>
                    ))}
                  </ul>
                )}
              </div>
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
