"use client";

import { Car } from "lucide-react";
import { Fragment, use, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddVehicleForm } from "@/features/user/components/add-vehicle-form";
import { Vehicle } from "@/lib/types";

export const MyVehicles = ({
  vehiclesPromise,
}: {
  vehiclesPromise: Promise<Vehicle[]>;
}) => {
  const [showForm, setShowForm] = useState(false);
  const vehicles = use(vehiclesPromise);

  if (!vehicles.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-slate-300 p-8">
        <Car className="stroke-slate-300 stroke-1" size={64} />
        <Button variant="outline">Add a Vehicle</Button>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex justify-between">
        <h2>My Cars</h2>
        <Button variant="outline" onClick={() => setShowForm((prev) => !prev)}>
          Add a Vehicle
        </Button>
      </div>

      {showForm && <AddVehicleForm />}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">MPG</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">{vehicle.name}</TableCell>
              <TableCell className="text-right">{vehicle.mpg}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
};
