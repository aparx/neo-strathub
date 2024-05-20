"use server";
import { getServiceServer } from "@/utils/supabase/actions";
import { InferAsync } from "@repo/utils";
import { cookies } from "next/headers";
import { cache } from "react";

export const getBlueprintCharacters = cache(async (blueprintId: string) => {
  // TODO USE ANON SERVER INSTEAD
  const { data, error } = await getServiceServer(cookies())
    .from("blueprint_character")
    .select(
      `id, index,
       team_player_slot(id, slot_index, color), 
       game_object(id, name, url)`,
    )
    .order("index")
    .eq("blueprint_id", blueprintId);
  if (error) throw error;
  return data;
});

export type BlueprintCharacterData = NonNullable<
  InferAsync<ReturnType<typeof getBlueprintCharacters>>
>[number];
