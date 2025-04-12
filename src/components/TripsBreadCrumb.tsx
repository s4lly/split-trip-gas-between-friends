import { ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { tripPath } from "@/paths";

export default function TripsBreadCrumb({
  tripId,
  children,
}: {
  tripId: string;
  children?: ReactNode;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* home */}
        <BreadcrumbItem>
          {children ? (
            <BreadcrumbLink href={tripPath(tripId)}>trip</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>trip</BreadcrumbPage>
          )}
        </BreadcrumbItem>

        {/* rest */}
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
