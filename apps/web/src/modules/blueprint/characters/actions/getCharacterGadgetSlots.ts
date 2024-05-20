"use server";
import { getServiceServer } from "@/utils/supabase/actions";
import { InferAsync } from "@repo/utils";
import { cookies } from "next/headers";
import { cache } from "react";

export const getCharacterGadgetSlots = cache(async (characterId: number) => {
  // TODO USE ANON SERVER INSTEAD
  const { data, error } = await getServiceServer(cookies())
    .from("character_gadget")
    .select("id, game_object(id, name, url)")
    .order("id")
    .eq("character_id", characterId);
  if (error) throw error;
  return data;
});

export type CharacterGadgetSlotData = NonNullable<
  InferAsync<ReturnType<typeof getCharacterGadgetSlots>>
>[number];
