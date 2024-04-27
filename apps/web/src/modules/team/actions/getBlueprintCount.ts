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
