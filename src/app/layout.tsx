import type { Metadata } from "next";
import "@/index.css";

export const metadata: Metadata = {
  title: "split trip gas between friends",
  description: "split trip gas between friends",
};

export default function RootLayout({
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
