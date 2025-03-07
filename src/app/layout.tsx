import Link from "next/link";
import type { Metadata } from "next";
import clsx from "clsx";

import { createClient } from "@/utils/supabase/server";

import "@/index.css";
import classes from "@/app/layout.module.css";

export const metadata: Metadata = {
  title: "split trip gas between friends",
  description: "split trip gas between friends",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <div className={classes.layoutContainer}>
          <header>
            <Link href="/">
              <h1>split trip gas</h1>
            </Link>

            <div
              className={clsx(classes.subHeader, !data.user && classes.login)}
            >
              {data.user && <div>{data.user.email}</div>}

              <nav>
                <ul className={classes.nav}>
                  {data.user ? (
                    <Link href="/logout">logout</Link>
                  ) : (
                    <Link href="/login">Login</Link>
                  )}
                </ul>
              </nav>
            </div>
          </header>

          <div id="root">{children}</div>
        </div>
      </body>
    </html>
  );
}
