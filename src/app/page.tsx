import { StateProvider } from "@/components/Context";
import Link from "next/link";
import MyTrips from "@/components/my-trips/my-trips";
import AuthenticationHeader from "@/components/authentication-header";

// import Car from "./Car";
// import People from "./People";
// import Search from "./Route";
// import Stops from "./Route/Stops";
// import GMap from "./Route/Map";

export default async function Home() {
  return (
    <StateProvider>
      <header>
        <Link href="/">
          <h1 className="mb-4 text-4xl hover:underline">split trip gas</h1>
        </Link>

        <AuthenticationHeader />
      </header>
      <section>
        <MyTrips />

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
      </section>
    </StateProvider>
  );
}
