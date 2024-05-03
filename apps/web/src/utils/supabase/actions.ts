import { createAnonServer, createServiceServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";

export const getServer = cache((cookie: ReturnType<typeof cookies>) => {
  return createAnonServer(cookie);
});

export const getServiceServer = cache((cookie: ReturnType<typeof cookies>) => {
  return createServiceServer(cookie);
});
