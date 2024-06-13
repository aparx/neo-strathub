import { getServer } from "@/utils/supabase/actions";
import { InferAsync } from "@repo/utils";
import { cookies } from "next/headers";
import "server-only";

export async function getBlueprintStages(blueprintId: string) {
  const { data } = await getServer(cookies())
    .from("blueprint_stage")
    .select()
    .eq("blueprint_id", blueprintId)
    .order("index")
    .throwOnError();
  return data;
}

export type BlueprintStageData = NonNullable<
  InferAsync<ReturnType<typeof getBlueprintStages>>
>[number];
