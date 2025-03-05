import Link from "next/link";
import type { Metadata } from "next";

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
  const { data, error } = await supabase.auth.getUser();

  let isLoggedIn = false;
  if (!error && data?.user) {
    isLoggedIn = true;
  }

  return (
    <html lang="en">
      <body>
        <div className={classes.layoutContainer}>
          <div>
            <Link href="/">
              <h1>split trip gas</h1>
            </Link>
            <div className={classes.subHeader}>
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
          </div>
          <div id="root">{children}</div>
        </div>
      </body>
    </html>
  );
}
