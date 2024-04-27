"use server";
import { getServer } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

export async function getBookCount(teamId: string) {
  return (
    await getServer(cookies())
      .from("book")
      .select("id", { count: "exact", head: true })
      .eq("team_id", teamId)
  )?.count;
}
