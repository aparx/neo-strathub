import { getServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";

export const getTeam = cache(async (teamId: string) => {
  return getServer(cookies())
    .from("team")
    .select("*, plan (id, name, pricing, is_default)")
    .eq("id", teamId)
    .maybeSingle();
});
