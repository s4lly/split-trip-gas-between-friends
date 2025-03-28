import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const supabase = await createClient();

  const { data: vehicles, error: vehiclesError } = await supabase
    .from("vehicle")
    .select("*")
    .eq("owner_id", userId);

  if (vehiclesError) {
    console.log("error: ", vehiclesError);
    redirect("/error");
  }

  return (
    <div>
      <h2>Cars</h2>

      {vehicles.length > 0 ? (
        <p>show cars</p>
      ) : (
        <div className="flex w-full flex-col items-center justify-center">
          <p>no cars</p>
          <button className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white">
            create
          </button>
        </div>
      )}
    </div>
  );
}
