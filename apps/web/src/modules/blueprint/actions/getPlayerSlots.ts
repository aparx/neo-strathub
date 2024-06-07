"use server";
import { createClient } from "@/utils/supabase/client";
import { InferAsync } from "@repo/utils";

export async function getPlayerSlots(teamId: string) {
  const { data } = await createClient()
    .from("player_slot")
    .select()
    .eq("team_id", teamId)
    .throwOnError();
  return data;
}

export type PlayerSlotData = NonNullable<
  InferAsync<ReturnType<typeof getPlayerSlots>>
>[number];
