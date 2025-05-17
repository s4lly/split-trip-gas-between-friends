import TripsBreadCrumb from "@/components/TripsBreadCrumb";
import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTripWithUsers } from "@/features/trip/actions/get-trip-with-users";
import { getUsersVehicles } from "@/features/trip/actions/get-users-vehicles";

export default async function DetailsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const tripWithUsers = await getTripWithUsers(tripId);
  const tripVehicles = await getUsersVehicles(tripWithUsers.users);

  return (
    <div className="space-y-2">
      <TripsBreadCrumb tripId={tripId}>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Overview</BreadcrumbPage>
        </BreadcrumbItem>
      </TripsBreadCrumb>

      <div>
        <h2 className="text-xl font-bold">people</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead className="text-right">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tripWithUsers.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell className="text-right">{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <h2 className="text-xl font-bold">vehicles</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead className="text-right">MPG</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tripVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.name}</TableCell>
                <TableCell className="text-right">{vehicle.mpg}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
