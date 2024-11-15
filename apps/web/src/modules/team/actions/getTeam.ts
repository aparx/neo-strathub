"use server";
import { getServer } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { cache } from "react";

export const getTeam = cache(async (teamId: string) => {
  return getServer(cookies())
    .from("team")
    .select(
      "*, plan(id, name, pricing, default_plan, config), game!inner(id, name, icon)",
    )
    .eq("id", teamId)
    .maybeSingle();
});
