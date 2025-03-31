"use client";

import { useState } from "react";
import { updateRoute } from "@/app/trips/[id]/routes/[routeId]/actions";
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
import { Vehicle } from "@/lib/types";

type UpdateVehicleFormProps = {
  tripId: number;
  routeId: number;
  selectedId: number | null;
  vehicles: Vehicle[];
};

const UpdateVehicleForm = ({
  tripId,
  routeId,
  selectedId,
  vehicles,
}: UpdateVehicleFormProps) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(() => {
    return selectedId == null ? "" : selectedId.toString();
  });

  const onVehicleChange = async (vehicleId: string) => {
    const updatedRoute = await updateRoute(tripId, routeId, {
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
