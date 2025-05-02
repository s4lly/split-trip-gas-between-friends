import { Suspense } from "react";
import { getMyVehicles } from "@/features/user/actions/get-my-vehicles";
import { MyVehicles } from "@/features/user/components/my-vehicles";

export default async function UserPage() {
  const vehiclesPromise = getMyVehicles();

  return (
    <div className="space-y-2 p-4">
      <Suspense fallback={<p>loading vehicles...</p>}>
        <MyVehicles vehiclesPromise={vehiclesPromise} />
      </Suspense>
    </div>
  );
}
