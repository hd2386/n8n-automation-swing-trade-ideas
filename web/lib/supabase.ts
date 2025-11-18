import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedAdminClient: SupabaseClient | null = null;

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const getSupabaseAdminClient = (): SupabaseClient => {
  if (cachedAdminClient) {
    return cachedAdminClient;
  }

  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  cachedAdminClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  return cachedAdminClient;
};
