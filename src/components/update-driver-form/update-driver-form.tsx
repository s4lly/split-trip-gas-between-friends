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
import { Profile } from "@/lib/types";

type UpdateDriverFormProps = {
  tripId: number;
  routeId: number;
  selectedId: string;
  profiles: Pick<Profile, "email" | "id">[];
};

const UpdateDriverForm = ({
  tripId,
  routeId,
  selectedId,
  profiles,
}: UpdateDriverFormProps) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>(selectedId);

  const onDriverChange = async (profileId: string) => {
    const updatedRoute = await updateRoute(tripId, routeId, {
      driver_id: profileId,
    });

    if (updatedRoute.driver_id) {
      setSelectedDriverId(updatedRoute.driver_id);
    }
  };

  if (!profiles.length) {
    return null;
  }

  return (
    <>
      <Label htmlFor="driver">Driver</Label>
      <Select
        name="driver"
        onValueChange={onDriverChange}
        value={selectedDriverId}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Driver" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Drivers</SelectLabel>
            {profiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                {profile.email}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default UpdateDriverForm;
