import { StateProvider } from "@/components/Context";
import Link from "next/link";
import MyTrips from "@/components/my-trips/my-trips";
import { User, List } from "@phosphor-icons/react/dist/ssr";

// import Car from "./Car";
// import People from "./People";
// import Search from "./Route";
// import Stops from "./Route/Stops";
// import GMap from "./Route/Map";

export default async function Home() {
  return (
    <StateProvider>
      <header>
        <nav className="flex justify-between items-center">
          <div>
            <Link href="/">
              <h1 className="text-4xl font-extrabold">split trip gas</h1>
            </Link>
          </div>

          <Link className="self-start" href={`/user/${123}`}>
            <List className="stroke-black size-6" />
          </Link>
        </nav>
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
