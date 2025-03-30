"use client";

import { updateRoute } from "@/app/trips/[id]/routes/[routeId]/actions";
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
  routeId: number;
  profiles: Pick<Profile, "email" | "id">[];
};

const UpdateDriverForm = ({ routeId, profiles }: UpdateDriverFormProps) => {
  const onDriverChange = (profileId: string) => {
    updateRoute(routeId, { driver_id: profileId });
  };

  return (
    <>
      {profiles.length > 0 && (
        <Select onValueChange={onDriverChange}>
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
      )}
    </>
  );
};

export default UpdateDriverForm;
