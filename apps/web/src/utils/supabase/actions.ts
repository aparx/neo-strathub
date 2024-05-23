import {
  createAuthenticatedServer,
  createServiceServer,
} from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";

export type SupabaseAnonServer = ReturnType<typeof getServer>;

export const getServer = cache((cookie: ReturnType<typeof cookies>) => {
  return createAuthenticatedServer(cookie);
});

export const getServiceServer = cache((cookie: ReturnType<typeof cookies>) => {
  return createServiceServer(cookie);
});
