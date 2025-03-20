import type { Metadata } from "next";
import "@/index.css";

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
        <div className="p-4">
          <div id="root">{children}</div>
        </div>
      </body>
    </html>
  );
}
