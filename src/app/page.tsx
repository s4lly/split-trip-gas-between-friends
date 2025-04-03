import { StateProvider } from "@/components/Context";
import LayoutDrawer from "@/components/layout-drawer";
import MyTrips from "@/components/my-trips/my-trips";

export default async function Home() {
  return (
    <StateProvider>
      <div className="p-4">
        <header>
          <nav className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold">split trip gas</h1>
            <LayoutDrawer />
          </nav>
        </header>
        <section>
          <MyTrips />
        </section>
      </div>
    </StateProvider>
  );
}
