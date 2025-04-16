import { ReactNode } from "react";

export default function NewDestinationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
