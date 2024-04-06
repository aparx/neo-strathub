"use server";
import { createServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";

export const getServer = cache((cookieStore: ReturnType<typeof cookies>) => {
  return createServer(cookieStore);
});
