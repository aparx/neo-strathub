"use server";
import { getServiceServer } from "@/utils/supabase/actions";
import { InferAsync } from "@repo/utils";
import { cookies } from "next/headers";

export async function getCharacterGadgetSlots(characterIds: number[]) {
  // TODO USE ANON SERVER INSTEAD
  const { data, error } = await getServiceServer(cookies())
    .from("character_gadget")
    .select("id, game_object(*), character_id")
    .order("id")
    .in("character_id", characterIds);
  if (error) throw error;
  return data;
}

export type CharacterGadgetSlotData = NonNullable<
  InferAsync<ReturnType<typeof getCharacterGadgetSlots>>
>[number];
