import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CarouselContent } from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { getPlacePhotos } from "@/features/trip/actions/get-place-photos";
import { MapGraph } from "@/features/trip/types";
import { useUserClient } from "@/hooks/use-user-client";
import { Profile as TripUser, Route, Vehicle } from "@/lib/types";
import { PlacePhotoContent } from "@/utils/valibot/place-details-schema";

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
  const [placePhotos, setPlacePhotos] = useState<PlacePhotoContent[]>([]);

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
        <div className="shrink-0 grow-0 basis-1/4">
          <div className="h-[75px] overflow-hidden rounded-md">
            {placePhotos.length === 0 ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <Dialog>
                <DialogTrigger className="h-full w-full">
                  <Image
                    src={placePhotos[0].photoUri}
                    className="h-full w-full object-cover"
                    alt="Place photo"
                    width={500}
                    height={75}
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <Carousel>
                    <CarouselContent>
                      {placePhotos.map((photo, index) => (
                        <CarouselItem key={index}>
                          <Image
                            src={photo.photoUri}
                            alt={`Place photo ${index + 1}`}
                            width={800}
                            height={600}
                            className="h-auto w-full rounded-lg object-cover"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </DialogContent>
              </Dialog>
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
