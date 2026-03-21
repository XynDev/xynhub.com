import type { User } from "@supabase/supabase-js";

// Hono environment bindings for typed context variables
export type AppEnv = {
  Variables: {
    user: User;
  };
};
