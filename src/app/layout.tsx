import "@/index.css";
import type { Metadata } from "next";

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
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
