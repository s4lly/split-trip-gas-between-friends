import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import { StateProvider } from "@/components/Context";
import classes from "@/app/page.module.css";

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

export default async function Home() {
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

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <StateProvider>
      <div className="content">
        <div className="app">
          <div>
            <div className={classes.tripsHeader}>
              <h2>My Trips</h2>
              <button>new</button>
            </div>
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
