import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { MapGraph } from "@/features/trip/types";
import { useUserClient } from "@/hooks/use-user-client";
import { Profile as TripUser, Route, Vehicle } from "@/lib/types";

export const SelectedDestinationDetails = ({
  destinationGraph,
  updateNewDestinationDetails,
  vehicles,
  users,
}: {
  destinationGraph: MapGraph | null;
  updateNewDestinationDetails: (details: Partial<Route>) => void;
  vehicles: Vehicle[];
  users: TripUser[];
}) => {
  const user = useUserClient();

  const [isUserClicked, setIsUserClicked] = useState(false);
  const [isCarClicked, setIsCarClicked] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();
  const [selectedUser, setSelectedUser] = useState<TripUser>();

  useEffect(() => {
    const userVehicle = vehicles.find((v) => v.owner_id === user?.id);
    const currentUser = users.find((u) => u.id === user?.id);

    setSelectedVehicle(userVehicle);
    setSelectedUser(currentUser);

    updateNewDestinationDetails({
      vehicle_id: userVehicle?.id,
      driver_id: currentUser?.id,
    });
  }, [
    user,
    vehicles,
    users,
    setSelectedVehicle,
    setSelectedUser,
    updateNewDestinationDetails,
  ]);

  const handleUserToggle = (pressed: boolean) => {
    setIsUserClicked(pressed);
    if (pressed) setIsCarClicked(false);
  };

  const handleCarToggle = (pressed: boolean) => {
    setIsCarClicked(pressed);
    if (pressed) setIsUserClicked(false);
  };

  const handleCarSelect = (vehicle: Vehicle) => {
    setIsCarClicked(false);
    setSelectedVehicle(vehicle);
    updateNewDestinationDetails({ vehicle_id: vehicle.id });
  };

  const handleUserSelect = (user: TripUser) => {
    setIsUserClicked(false);
    setSelectedUser(user);
    updateNewDestinationDetails({ driver_id: user.id });
  };

  if (!destinationGraph || destinationGraph.start !== destinationGraph.end) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="mt-2 flex w-full gap-2">
        <div className="grow">
          <p>
            {destinationGraph.start?.type === "suggestion"
              ? destinationGraph.start.placeSuggestion.text.text
              : ""}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          <Toggle
            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground w-full truncate"
            pressed={isUserClicked}
            onPressedChange={handleUserToggle}
            variant="outline"
          >
            <p className="w-full truncate">
              {selectedUser?.username ?? "No user selected"}
            </p>
          </Toggle>
        </div>
        <div className="w-1/2">
          <Toggle
            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground w-full truncate"
            pressed={isCarClicked}
            onPressedChange={handleCarToggle}
            variant="outline"
          >
            <p className="w-full truncate">
              {selectedVehicle?.name ?? "No vehicle available"}
            </p>
          </Toggle>
        </div>
      </div>

      {isUserClicked && (
        <div className="mt-2 flex flex-col gap-2">
          {users.map((user) => (
            <Button
              key={user.id}
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleUserSelect(user)}
            >
              {selectedUser?.id === user.id && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              <span>{user.username || "Unnamed User"}</span>
            </Button>
          ))}
        </div>
      )}

      {isCarClicked && (
        <div className="mt-2 flex flex-col gap-2">
          {vehicles.map((vehicle) => (
            <Button
              key={vehicle.id}
              variant="outline"
              onClick={() => handleCarSelect(vehicle)}
            >
              {selectedVehicle?.id === vehicle.id && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              <span>{vehicle.name || "Unnamed Vehicle"}</span>
              <span className="text-muted-foreground ml-auto">
                {vehicle.mpg ? `${vehicle.mpg} MPG` : "N/A"}
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
