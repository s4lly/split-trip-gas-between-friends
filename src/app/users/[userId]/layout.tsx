import { ReactNode } from "react";
import { Header } from "@/components/header";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ userId: string }>;
};

export default async function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="bg-gray-100">
        <Header>Profile</Header>
      </div>
      {children}
    </>
  );
}
