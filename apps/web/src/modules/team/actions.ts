"use server";
import { getServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";

export const getTeam = cache(async (teamId: string) => {
  return getServer(cookies())
    .from("team")
    .select("*, plan (id, name, pricing, is_default, config)")
    .eq("id", teamId)
    .maybeSingle();
});

export async function getMemberCount(teamId: string) {
  return (
    await getServer(cookies())
      .from("team_member")
      .select("id", { count: "exact", head: true })
      .eq("team_id", teamId)
  )?.count;
}

export async function getBookCount(teamId: string) {
  return (
    await getServer(cookies())
      .from("book")
      .select("id", { count: "exact", head: true })
      .eq("team_id", teamId)
  )?.count;
}

export async function getBlueprintCount(teamId: string) {
  return (
    await getServer(cookies())
      .from("blueprint")
      .select("id, book!inner(team_id)", { count: "exact", head: true })
      .eq("book.team_id", teamId)
  )?.count;
}
