import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY");

// TODO: Pass the generated TYPES (e.g., createClient<Database>)
export const supabase = createClient(url, key, { auth: {persistSession: false } });