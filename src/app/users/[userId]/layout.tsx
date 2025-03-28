import LayoutDrawer from "@/components/layout-drawer";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ userId: string }>;
};

export default async function Layout({ children, params }: LayoutProps) {
  const { userId } = await params;

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.log("error: ", error);
    redirect("/error");
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h1 className="text-2xl font-extrabold">{profile?.email}</h1>
        </div>
        <LayoutDrawer />
      </div>
      {children}
    </div>
  );
}
