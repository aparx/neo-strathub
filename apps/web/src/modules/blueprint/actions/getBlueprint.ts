"use server";
import { getServer } from "@/utils/supabase/actions";
import { InferAsync } from "@repo/utils";
import { cookies } from "next/headers";
import { cache } from "react";

export type DefaultBlueprintData = NonNullable<
  InferAsync<ReturnType<typeof getBlueprint>>["data"]
>;

export const getBlueprint = cache(async (id: string) => {
  const { data, error } = await getServer(cookies())
    .from("blueprint")
    .select(
      `id, visibility, name, tags,
       book!inner(id, name, team!inner(id, name)), 
       arena!inner(id, name, game_id, outdated)`,
    )
    .eq("id", id)
    .maybeSingle();
  if (error) return { state: "error", error } as const;
  return { state: "success", data } as const;
});
