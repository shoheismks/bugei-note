import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("SUPABASE URL:", supabaseUrl);
console.log("SUPABASE KEY EXISTS:", Boolean(supabaseAnonKey));
console.log("SUPABASE KEY HEAD:", supabaseAnonKey?.slice(0, 14));

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);