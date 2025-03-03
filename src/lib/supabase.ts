import { createClient } from "@supabase/supabase-js";

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// @ts-expect-error ignore env vars possibly being undefined
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
