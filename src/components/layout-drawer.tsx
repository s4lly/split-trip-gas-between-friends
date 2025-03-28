"use server";

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
import { createClient } from "@/utils/supabase/server";
import { House, List } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LayoutDrawer() {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.log("authError: ", authError);
    redirect("/error");
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger className="self-start">
        <List className="size-6 stroke-black" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{auth?.user?.email}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="flex basis-full flex-col justify-between">
          <Link className="flex items-center gap-1" href={"/"}>
            <House />
            Home
          </Link>
          <Link href={"/logout"}>Logout</Link>
        </div>
        <DrawerFooter>
          <DrawerClose>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
