import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { errorPath } from "@/paths";
import { createClient } from "@/utils/supabase/client";

export function useUserClient() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          console.error("No authenticated user found:", error);
          redirect(errorPath());
          return;
        }

        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        redirect(errorPath());
      }
    };

    fetchUser();
  }, []);

  return user;
}
