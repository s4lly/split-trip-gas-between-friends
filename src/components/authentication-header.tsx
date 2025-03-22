import Link from "next/link";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/server";

export default async function AuthenticationHeader() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  return (
    <div
      className={clsx(
        "flex justify-between items-center",
        !auth.user && "flex-row-reverse"
      )}
    >
      {auth.user && <div>{auth.user.email}</div>}

      <nav>
        <ul>
          {auth.user ? (
            <Link href="/logout">logout</Link>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </ul>
      </nav>
    </div>
  );
}
