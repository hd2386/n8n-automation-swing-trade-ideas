import { createBrowserClient } from "@supabase/ssr";

// Read environment variables at module level (not inside function)
// Next.js replaces these at build-time for client-side code
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

// Browser client for client-side auth
export const createBrowserSupabase = () => {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};
