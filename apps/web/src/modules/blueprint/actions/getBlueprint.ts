"use server";
import { createAnonServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";

export const getBlueprint = cache(async (id: string) => {
  const { data, error } = await createAnonServer(cookies())
    .from("blueprint")
    .select(
      `id, visibility, name, tags,
       book!inner(id, name, team!inner(id, name)), 
       arena(id, name)`,
    )
    .eq("id", id)
    .maybeSingle();
  if (error) return { state: "error", error } as const;
  return { state: "success", data } as const;
});
