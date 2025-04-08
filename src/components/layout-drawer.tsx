"use server";

import { House, List, User, X } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getProfile } from "@/features/user/actions/get-profile";

export default async function LayoutDrawer() {
  const profile = await getProfile();

  return (
    <Drawer direction="right">
      <DrawerTrigger className="self-start">
        <List className="size-6 stroke-black" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <div className="flex items-center justify-between">
              <div>{profile.username}</div>
              <DrawerClose tabIndex={0} asChild>
                <X />
              </DrawerClose>
            </div>
          </DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="flex basis-full flex-col justify-between p-4">
          <div>
            <Link className="flex items-center gap-1" href={"/"}>
              <House />
              Home
            </Link>
            <Link
              className="flex items-center gap-1"
              href={`/users/${profile.id}`}
            >
              <User />
              Profile
            </Link>
          </div>
          <Link href={"/logout"}>Logout</Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
