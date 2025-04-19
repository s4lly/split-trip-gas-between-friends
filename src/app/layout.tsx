import "@/index.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "split trip gas between friends",
  description: "split trip gas between friends",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
