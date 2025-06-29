"use client";

import { Car } from "lucide-react";
import { Dispatch, Fragment, SetStateAction, use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { AddVehicleForm } from "@/features/user/components/add-vehicle-form";
import { Vehicle } from "@/lib/types";

const EmptyState = ({
  setShowCreateForm,
}: {
  setShowCreateForm: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-slate-300 p-8">
      <Car className="stroke-slate-300 stroke-1" size={64} />
      <Button onClick={() => setShowCreateForm(true)} variant="outline">
        Add car
      </Button>
    </div>
  );
};

export const MyVehicles = ({
  vehiclesPromise,
}: {
  vehiclesPromise: Promise<Vehicle[]>;
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const vehicles = use(vehiclesPromise);
  const isEmpty = !vehicles.length;

  let content =
    showAddForm || showCreateForm ? (
      <AddVehicleForm />
    ) : (
      <div className="max-h-1/2 overflow-y-auto">
        <Table>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="px-0 py-2 text-left font-medium">
                  {vehicle.name}
                </TableCell>
                <TableCell className="px-0 py-2 text-right">
                  {vehicle.mpg}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );

  if (isEmpty && !showCreateForm) {
    content = <EmptyState setShowCreateForm={setShowCreateForm} />;
  }

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <h2>My Cars</h2>
        {(!isEmpty || showCreateForm) && (
          <Toggle
            pressed={showAddForm}
            onPressedChange={
              showCreateForm ? setShowCreateForm : setShowAddForm
            }
            variant="outline"
          >
            {showAddForm || showCreateForm ? "Cancel" : "Add car"}
          </Toggle>
        )}
      </div>

      {content}
    </Fragment>
  );
};
