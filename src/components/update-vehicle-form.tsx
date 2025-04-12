"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateDestination } from "@/features/trip/actions/update-destination";
import { Vehicle } from "@/lib/types";

type UpdateVehicleFormProps = {
  tripId: number;
  destinationId: number;
  selectedId: number | null;
  vehicles: Vehicle[];
};

const UpdateVehicleForm = ({
  tripId,
  destinationId,
  selectedId,
  vehicles,
}: UpdateVehicleFormProps) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(() => {
    return selectedId == null ? "" : selectedId.toString();
  });

  const onVehicleChange = async (vehicleId: string) => {
    const updatedRoute = await updateDestination(tripId, destinationId, {
      vehicle_id: parseInt(vehicleId, 10),
    });

    if (updatedRoute.vehicle_id) {
      setSelectedVehicleId(updatedRoute.vehicle_id.toString());
    }
  };

  if (!vehicles.length) {
    return null;
  }

  // TODO consider not showing all, maybe only for people assigned to route
  return (
    <>
      <Label>Vehicle</Label>
      <Select onValueChange={onVehicleChange} value={selectedVehicleId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Driver" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Vehicles</SelectLabel>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                {vehicle.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default UpdateVehicleForm;
