import { Car } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { StateProvider } from "@/components/Context";
import LayoutDrawer from "@/components/layout-drawer";
import MySharedTrips from "@/components/my-shared-trips";
import MyTrips from "@/components/my-trips";
import { Button } from "@/components/ui/button";
import { tripNewPath } from "@/paths";

export default async function Home() {
  return (
    <StateProvider>
      <div className="space-y-2 p-4">
        <header className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <Car size={36} weight="duotone" />
            <h1 className="text-4xl font-extrabold">split trip gas</h1>
          </div>
          <LayoutDrawer />
        </header>

        <section>
          <Button className="w-full" asChild>
            <Link className="text-yellow-300" href={tripNewPath()}>
              New trip
            </Link>
          </Button>
        </section>

        <section>
          <MySharedTrips />
        </section>

        <section>
          <MyTrips />
        </section>
      </div>
    </StateProvider>
  );
}
