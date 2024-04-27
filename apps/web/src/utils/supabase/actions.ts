import { createAnonServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";

export const getServer = cache((cookieStore: ReturnType<typeof cookies>) => {
  return createAnonServer(cookieStore);
});
