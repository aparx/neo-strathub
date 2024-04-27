"use server";
import { getServer } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

export async function getBlueprintCount(teamId: string) {
  return (
    await getServer(cookies())
      .from("blueprint")
      .select("id, book!inner(team_id)", { count: "exact", head: true })
      .eq("book.team_id", teamId)
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

export async function getMemberCount(teamId: string) {
  return (
    await getServer(cookies())
      .from("team_member")
      .select("*", { count: "exact", head: true })
      .eq("team_id", teamId)
  )?.count;
}
