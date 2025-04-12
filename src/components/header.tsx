import { Car } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ReactNode } from "react";
import LayoutDrawer from "@/components/layout-drawer";
import { Separator } from "@/components/ui/separator";
import { homePath } from "@/paths";

export const Header = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-1">
          <Link href={homePath()}>
            <Car size={32} weight="duotone" />
          </Link>
          <span>/</span>
          <h1 className="text-2xl font-extrabold">{children}</h1>
        </div>
        <LayoutDrawer />
      </header>
      <Separator />
    </>
  );
};
