import clsx from "clsx";
import { Car, CheckCircle2, Settings, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapGraph } from "@/features/trip/types";
import { useUserClient } from "@/hooks/use-user-client";
import { Profile as TripUser, Route, Vehicle } from "@/lib/types";

enum Buttons {
  Passengers = "passengers",
  Vehicle = "vehicle",
  Settings = "settings",
}

export const SelectedDestinationDetails = ({
  destinationGraph,
  updateNewDestinationDetails,
  vehicles,
  users,
  setIsPlaceSuggestionSelected,
}: {
  destinationGraph: MapGraph | null;
  updateNewDestinationDetails: (details: Partial<Route>) => void;
  vehicles: Vehicle[];
  users: TripUser[];
  setIsPlaceSuggestionSelected: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const user = useUserClient();

  const [selectedButton, setSelectedButton] = useState<Buttons | null>(null);
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

  const handleCarSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    updateNewDestinationDetails({ vehicle_id: vehicle.id });
  };

  const handleUserSelect = (user: TripUser) => {
    setSelectedUser(user);
    updateNewDestinationDetails({ driver_id: user.id });
  };

  if (!destinationGraph || destinationGraph.start !== destinationGraph.end) {
    return null;
  }

  return (
    <div className="flex min-h-0 flex-col gap-2">
      <div className="mt-2 flex w-full shrink-0 gap-2">
        <div className="grow">
          <p>
            {destinationGraph.start?.type === "suggestion"
              ? destinationGraph.start.placeSuggestion.text.text
              : ""}
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsPlaceSuggestionSelected(false)}
        >
          <X className="size-[24px]" />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-md border p-2">
        {/* Buttons */}
        <div className="flex shrink-0 justify-between">
          <button
            className="shrink grow basis-0 p-2"
            onClick={() =>
              setSelectedButton(
                selectedButton === Buttons.Passengers
                  ? null
                  : Buttons.Passengers,
              )
            }
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={clsx(
                  "grid size-10 place-items-center rounded-full bg-blue-200 active:bg-blue-400",
                  selectedButton === Buttons.Passengers && "bg-blue-400",
                )}
              >
                <Users className="size-6" />
              </div>
              <p className="text-center text-sm font-medium">Passangers</p>
            </div>
          </button>

          <button
            className="shrink grow basis-0 p-2"
            onClick={() =>
              setSelectedButton(
                selectedButton === Buttons.Vehicle ? null : Buttons.Vehicle,
              )
            }
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={clsx(
                  "grid size-10 place-items-center rounded-full bg-blue-200 active:bg-blue-400",
                  selectedButton === Buttons.Vehicle && "bg-blue-400",
                )}
              >
                <Car className="size-6" />
              </div>
              <p className="text-center text-sm font-medium">Vehicle</p>
            </div>
          </button>

          <button
            className="shrink grow basis-0 p-2"
            onClick={() =>
              setSelectedButton(
                selectedButton === Buttons.Settings ? null : Buttons.Settings,
              )
            }
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={clsx(
                  "grid size-10 place-items-center rounded-full bg-blue-200 active:bg-blue-400",
                  selectedButton === Buttons.Settings && "bg-blue-400",
                )}
              >
                <Settings className="size-6" />
              </div>
              <p className="text-center text-sm font-medium">Settings</p>
            </div>
          </button>
        </div>

        {/* Details */}
        {selectedButton === Buttons.Passengers && (
          <div className="flex flex-1 flex-col space-y-2 overflow-y-auto">
            <h4 className="text-sm font-medium">Select Driver</h4>
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
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    {user.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{user.username || "Unnamed User"}</span>
              </Button>
            ))}
          </div>
        )}

        {selectedButton === Buttons.Vehicle && (
          <div className="flex flex-1 flex-col space-y-2 overflow-y-auto">
            <h4 className="text-sm font-medium">Select Vehicle</h4>
            {vehicles.map((vehicle) => (
              <Button
                key={vehicle.id}
                variant="outline"
                className="w-full justify-start gap-2"
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

        {selectedButton === Buttons.Settings && (
          <div className="flex flex-1 flex-col space-y-2 overflow-y-auto">
            <h4 className="text-sm font-medium">Settings</h4>
          </div>
        )}
      </div>
    </div>
  );
};
