import { Circle } from "@phosphor-icons/react/dist/ssr";
import StaticMap from "@/components/static-map";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTripGraph } from "@/features/trip/actions/get-trip-graph";
import {
  convertMetersToMiles,
  convertSecondsToHoursAndMinutes,
  formatTime,
  TripGraphNodes,
} from "@/features/trip/utils";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tripGraph = await getTripGraph(id);

  return (
    <div className="space-y-4">
      <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Person</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Owed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Person 1</TableCell>
              <TableCell>
                <Badge className="bg-green-500">Driver</Badge>
              </TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Person 2</TableCell>
              <TableCell>
                <Badge className="bg-yellow-500">Passanger</Badge>
              </TableCell>
              <TableCell className="text-right">$30.00</TableCell>
            </TableRow>
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
                      {
                        tripNode.destination.details.structuredFormat.mainText
                          .text
                      }
                    </CardTitle>
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
                  <div className="grow">
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
                    <p>Driver: person 0</p>
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
