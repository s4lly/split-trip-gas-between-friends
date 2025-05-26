import { Suspense } from "react";
import { getMyVehicles } from "@/features/user/actions/get-my-vehicles";
import { getProfile } from "@/features/user/actions/get-profile";
import { MyVehicles } from "@/features/user/components/my-vehicles";

export default async function UserPage() {
  const profile = await getProfile();
  const vehiclesPromise = getMyVehicles();

  return (
    <div className="space-y-2 p-4">
      <h2 className="text-2xl font-bold">{profile?.username}</h2>
      <Suspense fallback={<p>loading vehicles...</p>}>
        <MyVehicles vehiclesPromise={vehiclesPromise} />
      </Suspense>
    </div>
  );
}
