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
import { getTripWithUsers } from "@/features/trip/actions/get-trip-with-users";
import { getUsersVehicles } from "@/features/trip/actions/get-users-vehicles";
import { MapGraph } from "@/features/trip/types";
import { Route } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";

type Vehicle = {
  id: number;
  name: string | null;
  mpg: number | null;
  owner_id: string | null;
};

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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedCarIndex, setSelectedCarIndex] = useState<number | null>(null);
  const [selectedVehicleName, setSelectedVehicleName] = useState<string>("");
  const [isVehiclesLoading, startVehiclesTransition] = useTransition();

  useEffect(() => {
    startVehiclesTransition(async () => {
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

        const userVehicle = vehiclesData.find((v) => v.owner_id === user.id);

        if (!userVehicle) {
          console.error("No user vehicle found");
          return;
        }

        // update local state
        setSelectedVehicleName(userVehicle.name ?? "");
        setSelectedCarIndex(
          vehiclesData.findIndex((v) => v.id === userVehicle.id),
        );

        // update new destination details
        updateNewDestinationDetails({ vehicle_id: userVehicle.id });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });
  }, [tripId, startVehiclesTransition, updateNewDestinationDetails]);

  const handleUserToggle = (pressed: boolean) => {
    setIsUserClicked(pressed);
    if (pressed) setIsCarClicked(false);
  };

  const handleCarToggle = (pressed: boolean) => {
    setIsCarClicked(pressed);
    if (pressed) setIsUserClicked(false);
  };

  const handleCarSelect = (index: number) => {
    setSelectedCarIndex(index === selectedCarIndex ? null : index);
    updateNewDestinationDetails({ vehicle_id: vehicles[index].id });
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
            src="/images/apartment.jpg"
            alt="apartment"
            width={500}
            height={300}
            priority
          />
        </div>
        <div className="grow">
          <p>180 El Camino Real, San Carlos, CA 94070</p>
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
            user123
          </Toggle>
        </div>
        <div className="w-1/2">
          <Toggle
            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground w-full truncate"
            pressed={isCarClicked}
            onPressedChange={handleCarToggle}
            variant="outline"
          >
            {isVehiclesLoading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <p className="w-full truncate">{selectedVehicleName}</p>
            )}
          </Toggle>
        </div>
      </div>

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
              {vehicles.map((vehicle, index) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCarIndex === index}
                      onCheckedChange={() => handleCarSelect(index)}
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
