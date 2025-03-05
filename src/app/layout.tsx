import Link from "next/link";
import type { Metadata } from "next";

import "@/index.css";
import classes from "@/app/layout.module.css";

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
        <div>
          <h1>split strip gas between friends</h1>
          <nav>
            <ul className={classes.nav}>
              <Link href="/">Home</Link>
              <Link href="/login">Login</Link>
            </ul>
          </nav>
        </div>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
