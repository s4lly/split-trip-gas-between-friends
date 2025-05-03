import { Header } from "@/components/header";

export default async function NewTripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="bg-gray-100">
        <Header>New Trip</Header>
      </div>
      <div className="grow px-4 pt-2 pb-4">{children}</div>
    </div>
  );
}
