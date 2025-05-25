import { CheckCircle2, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { getPlacePhotos } from "@/features/trip/actions/get-place-photos";
import { getTripWithUsers } from "@/features/trip/actions/get-trip-with-users";
import { getUsersVehicles } from "@/features/trip/actions/get-users-vehicles";
import { MapGraph } from "@/features/trip/types";
import { Profile as TripUser, Route, Vehicle } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import { PlacePhotoContent } from "@/utils/valibot/place-details-schema";

export const SelectedDestinationDetails = ({
  destinationGraph,
  tripId,
  updateNewDestinationDetails,
}: {
  destinationGraph: MapGraph | null;
  tripId: string;
  updateNewDestinationDetails: (details: Partial<Route>) => void;
}) => {
  const [isUserClicked, setIsUserClicked] = useState(false);
  const [isCarClicked, setIsCarClicked] = useState(false);

  const [placePhotos, setPlacePhotos] = useState<PlacePhotoContent[]>([]);
  const [isTripDataLoading, startTripDataTransition] = useTransition();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<TripUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<TripUser>();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();

  useEffect(() => {
    const startNode = destinationGraph?.start;

    if (startNode?.type === "suggestion") {
      getPlacePhotos(startNode.placeSuggestion).then((photos) => {
        setPlacePhotos(photos);
      });
    } else {
      setPlacePhotos([]);
    }
  }, [destinationGraph?.start]);

  useEffect(() => {
    startTripDataTransition(async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.error("No authenticated user found");
          return;
        }

        const tripData = await getTripWithUsers(tripId);
        const vehiclesData = await getUsersVehicles(tripData.users);

        setVehicles(vehiclesData);
        setUsers(tripData.users);

        const userVehicle = vehiclesData.find((v) => v.owner_id === user.id);
        const currentUser = tripData.users.find((u) => u.id === user.id);

        setSelectedVehicle(userVehicle);
        setSelectedUser(currentUser);

        // update new destination details
        updateNewDestinationDetails({
          vehicle_id: userVehicle?.id,
          driver_id: currentUser?.id,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });
  }, [tripId, updateNewDestinationDetails]);

  const handleUserToggle = (pressed: boolean) => {
    setIsUserClicked(pressed);
    if (pressed) setIsCarClicked(false);
  };

  const handleCarToggle = (pressed: boolean) => {
    setIsCarClicked(pressed);
    if (pressed) setIsUserClicked(false);
  };

  const handleCarSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    updateNewDestinationDetails({ vehicle_id: vehicle.id });
  };

  const handleUserSelect = (user: TripUser) => {
    setSelectedUser(user);
  };

  if (!destinationGraph || destinationGraph.start !== destinationGraph.end) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="mt-2 flex w-full gap-2">
        <div className="shrink-0 grow-0 basis-1/4">
          <div className="h-[75px] overflow-hidden rounded-md">
            {placePhotos.length === 0 ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <Image
                className="h-full w-full object-cover"
                src={placePhotos[0].photoUri}
                alt="Place photo"
                width={500}
                height={75}
              />
            )}
          </div>
        </div>
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
            {isTripDataLoading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <p className="w-full truncate">
                {selectedUser?.username ?? "No user selected"}
              </p>
            )}
          </Toggle>
        </div>
        <div className="w-1/2">
          <Toggle
            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground w-full truncate"
            pressed={isCarClicked}
            onPressedChange={handleCarToggle}
            variant="outline"
          >
            {isTripDataLoading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <p className="w-full truncate">
                {selectedVehicle?.name ?? "No vehicle available"}
              </p>
            )}
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
