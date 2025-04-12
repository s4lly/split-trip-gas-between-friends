import { Circle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import StaticMap from "@/components/static-map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTripGraph } from "@/features/trip/actions/get-trip-graph";
import { RouteNode } from "@/features/trip/types";
import {
  convertMetersToMiles,
  convertSecondsToHoursAndMinutes,
  formatTime,
  TripGraphNodes,
} from "@/features/trip/utils";
import { destinationPath } from "@/paths";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tripGraph = await getTripGraph(id);

  // for each route
  // - driver
  // - car

  // calculat how much it cost for gas between start and finish
  // expense: { routeNode: RouteNode, expense: { amount: number, currency: CURRENCY }, driver: uiud }

  type Expense = {
    routeNode: RouteNode;
    expense: { amount: number; currency: "USD" };
    username: string;
    id: string;
  };
  const driverToExpensesMap: Map<string, Expense[]> = new Map();
  for (const tripNode of TripGraphNodes(tripGraph)) {
    const { route } = tripNode;

    if (route) {
      const distanceInMiles = convertMetersToMiles(route.distanceMeters);

      const driverId = tripNode.destination.driver_id;
      const driverUsername = tripNode.destination.profile?.username;
      const mpg = tripNode.destination.vehicle?.mpg;

      if (driverId && driverUsername && mpg) {
        let driverExpenses = driverToExpensesMap.get(driverId);

        if (!driverExpenses) {
          driverExpenses = [];
          driverToExpensesMap.set(driverId, driverExpenses);
        }

        // 40 m/g
        // 7 d/g

        // 2 m * (1 g/40 m) = 0.05 g
        // 0.05 g * (7 d/1 g) = .35

        // how much is gas per gallon
        const GAS_PER_GALLON = 7;

        driverExpenses.push({
          id: driverId,
          username: driverUsername,
          routeNode: route,
          expense: {
            amount: distanceInMiles * (1 / mpg) * GAS_PER_GALLON,
            currency: "USD",
          },
        });
      }
    }
  }

  return (
    <div className="space-y-4">
      <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Person</TableHead>
              <TableHead className="text-right">Owed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from(driverToExpensesMap.entries()).map(
              ([driverId, expenses]) => {
                let total = 0;
                let username = "";
                for (const expense of expenses) {
                  username = expense.username;
                  total += expense.expense.amount;
                }

                return (
                  <TableRow key={driverId}>
                    <TableCell className="font-medium">{username}</TableCell>
                    <TableCell className="text-right">{`$${total.toFixed(2)}`}</TableCell>
                  </TableRow>
                );
              },
            )}
          </TableBody>
        </Table>
      </section>
      <section className="space-y-2">
        {Array.from(TripGraphNodes(tripGraph)).map((tripNode) => {
          return (
            <div className="space-y-2" key={tripNode.destination.id}>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Link
                        href={destinationPath(
                          tripNode.destination.trip_id,
                          tripNode.destination.id,
                        )}
                      >
                        {
                          tripNode.destination.details.structuredFormat.mainText
                            .text
                        }
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      Driver: {tripNode.destination.profile?.username}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StaticMap coordinate={tripNode.coordinates} />
                  </CardContent>
                </Card>
              </div>

              {tripNode?.route && (
                <div className="flex gap-2">
                  <div className="flex flex-col">
                    <Circle className="" />
                    <div className="ml-1.5 grow border-l-3 border-dotted"></div>
                    <Circle className="" />
                  </div>
                  <div className="grow py-4">
                    <p>
                      Distance:{" "}
                      {convertMetersToMiles(tripNode.route.distanceMeters)}{" "}
                      miles
                    </p>
                    <p>
                      Duration:{" "}
                      {formatTime(
                        convertSecondsToHoursAndMinutes(
                          tripNode.route.duration,
                        ),
                      )}
                    </p>
                    <p>riders: person 1, person 2, person 3</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
