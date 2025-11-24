import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn("⚠️  Supabase credentials not configured. Some features may not work.");
}

// Service role client (for admin operations)
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Anon client (for user operations)
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export { supabaseUrl, supabaseServiceRoleKey, supabaseAnonKey };

