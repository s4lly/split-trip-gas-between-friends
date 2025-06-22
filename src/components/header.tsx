import { CarFront, User } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { homePath } from "@/paths";

export const Header = ({ children }: { children: ReactNode }) => {
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
        <div className="flex size-10 items-center justify-center rounded-full border border-gray-600 bg-blue-100 p-2">
          <User size={32} className="" />
        </div>
      </header>
      <Separator className="shadow-sm" />
    </>
  );
};
