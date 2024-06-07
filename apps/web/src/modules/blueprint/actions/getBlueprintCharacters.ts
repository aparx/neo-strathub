"use server";
import { getServiceServer } from "@/utils/supabase/actions";
import { InferAsync } from "@repo/utils";
import { cookies } from "next/headers";

export async function getBlueprintCharacters(blueprintId: string) {
  // TODO USE ANON SERVER INSTEAD
  const { data } = await getServiceServer(cookies())
    .from("blueprint_character")
    .select(
      `id, index,
       player_slot(id, index, color), 
       game_object(*)`,
    )
    .order("index")
    .eq("blueprint_id", blueprintId)
    .throwOnError();
  return data ?? [];
}

export type BlueprintCharacterData = NonNullable<
  InferAsync<ReturnType<typeof getBlueprintCharacters>>
>[number];
