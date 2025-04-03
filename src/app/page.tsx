import Link from "next/link";
import { StateProvider } from "@/components/Context";
import LayoutDrawer from "@/components/layout-drawer";
import MyTrips from "@/components/my-trips/my-trips";

export default async function Home() {
  return (
    <StateProvider>
      <header>
        <nav className="flex items-center justify-between">
          <div>
            <Link href="/">
              <h1 className="text-4xl font-extrabold">split trip gas</h1>
            </Link>
          </div>
          <LayoutDrawer />
        </nav>
      </header>
      <section>
        <MyTrips />
      </section>
    </StateProvider>
  );
}
