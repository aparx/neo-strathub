"use server";
import { getServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getMemberCount(teamId: string) {
  return (
    await getServer(cookies())
      .from("team_member")
      .select("*", { count: "exact", head: true })
      .eq("team_id", teamId)
  )?.count;
}
