import { ReactNode } from "react";

export default function NewDestinationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="mx-auto h-screen bg-white px-4">{children}</div>;
}
