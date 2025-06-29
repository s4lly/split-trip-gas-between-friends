import { CarFront, User } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getMyVehicles } from "@/features/user/actions/get-my-vehicles";
import { getProfile } from "@/features/user/actions/get-profile";
import { MyVehicles } from "@/features/user/components/my-vehicles";
import { homePath } from "@/paths";
import { DialogHeader } from "./ui/dialog";

export const Header = async ({ children }: { children: ReactNode }) => {
  const profile = await getProfile();
  const vehiclesPromise = getMyVehicles();

  return (
    <>
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-1">
          <Link href={homePath()}>
            <CarFront size={32} className="" />
          </Link>
          <span>/</span>
          <h1 className="text-2xl font-extrabold">{children}</h1>
        </div>

        <Dialog>
          <DialogTrigger>
            <div className="flex size-10 items-center justify-center rounded-full border border-gray-600 bg-blue-100 p-2">
              <User size={32} className="" />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-left">Profile</DialogTitle>
              <DialogDescription className="text-left">
                {profile?.username}
              </DialogDescription>
            </DialogHeader>
            <MyVehicles vehiclesPromise={vehiclesPromise} />
          </DialogContent>
        </Dialog>
      </header>
      <Separator className="shadow-sm" />
    </>
  );
};
