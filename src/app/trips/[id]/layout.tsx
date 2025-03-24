import { createClient } from "@/utils/supabase/server";
import { List } from "@phosphor-icons/react/dist/ssr";
import { QueryData } from "@supabase/supabase-js";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const tripId = parseInt(id, 10);
  if (isNaN(tripId)) {
    console.log("tripId is not a number: ", id);
    redirect("/error");
  }

  const profilesWithinTripQuery = supabase
    .from("trip")
    .select(
      `
          *,
          profile (
            *
          )
          `,
    )
    .eq("id", tripId)
    .single();

  const { data, error: tripError } = await profilesWithinTripQuery;
  if (tripError) {
    console.log(tripError);
    redirect("/error");
  }

  type ProfilesWithinTripQuery = QueryData<typeof profilesWithinTripQuery>;
  const trip: ProfilesWithinTripQuery = data;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h1 className="text-2xl font-extrabold">{trip.name}</h1>
        </div>

        {/* <Link className="self-start" href={`/user/${123}`}>
        </Link> */}

        <Drawer direction="right">
          <DrawerTrigger className="self-start">
            <List className="size-6 stroke-black" />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>Close</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      {children}
    </div>
  );
}
