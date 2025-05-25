import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { getPlacePhotos } from "@/features/trip/actions/get-place-photos";
import { getTripWithUsers } from "@/features/trip/actions/get-trip-with-users";
import { getUsersVehicles } from "@/features/trip/actions/get-users-vehicles";
import { MapGraph } from "@/features/trip/types";
import { Profile as TripUser, Route, Vehicle } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";

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
  const [placePhotoUri, setPlacePhotoUri] = useState<string>(
    "/images/apartment.jpg",
  );

  const [isTripDataLoading, startTripDataTransition] = useTransition();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<TripUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<TripUser>();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();

  // Fetch place photos when destination changes
  useEffect(() => {
    const startNode = destinationGraph?.start;

    if (startNode?.type === "suggestion") {
      const fetchPlacePhotos = async () => {
        try {
          const photos = await getPlacePhotos(startNode.placeSuggestion);

          if (photos.length > 0) {
            // Get a random photo from the list
            const randomPhoto =
              photos[Math.floor(Math.random() * photos.length)];

            if (randomPhoto.photoUri) {
              setPlacePhotoUri(randomPhoto.photoUri);
            }
          }
        } catch (error) {
          console.error("Error fetching place photos:", error);
        }
      };

      fetchPlacePhotos();
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

        // update local state
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
  }, [tripId, startTripDataTransition, updateNewDestinationDetails]);

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
          <Image
            className="block h-auto w-full"
            src={placePhotoUri}
            alt="Place photo"
            width={500}
            height={300}
            priority
          />
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
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>User Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUser?.id === user.id}
                      onCheckedChange={() => handleUserSelect(user)}
                    />
                  </TableCell>
                  <TableCell>{user.username || "Unnamed User"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {isCarClicked && (
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Car Name</TableHead>
                <TableHead className="text-right">MPG</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedVehicle?.id === vehicle.id}
                      onCheckedChange={() => handleCarSelect(vehicle)}
                    />
                  </TableCell>
                  <TableCell>{vehicle.name || "Unnamed Vehicle"}</TableCell>
                  <TableCell className="text-right">
                    {vehicle.mpg || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
