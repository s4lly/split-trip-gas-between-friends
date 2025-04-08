import { ReactNode } from "react";
import { Header } from "@/components/header";
import { getProfile } from "@/features/user/actions/get-profile";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ userId: string }>;
};

export default async function Layout({ children }: LayoutProps) {
  const profile = await getProfile();

  return (
    <>
      <div className="bg-gray-100">
        <Header>{profile?.username}</Header>
      </div>
      {children}
    </>
  );
}
