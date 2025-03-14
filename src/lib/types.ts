import { Database } from "@/utils/supabase/database.types";
export type Trip = Database["public"]["Tables"]["trip"]["Row"];
export type Route = Database["public"]["Tables"]["route"]["Row"];
export type Destination = Database["public"]["Tables"]["destination"]["Row"];
export type Vehicle = Database["public"]["Tables"]["vehicle"]["Row"];
