"use server";
import { getServer } from "@/utils/supabase/actions";
import { InferAsync } from "@repo/utils";
import { cookies } from "next/headers";
import { cache } from "react";

export const getLevels = cache(async (arenaId: number) => {
  const { data } = await getServer(cookies())
    .from("arena_level")
    .select()
    .eq("arena_id", arenaId);
  return data;
});

export type ArenaLevelData = NonNullable<
  InferAsync<ReturnType<typeof getLevels>>
>[number];
