import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

async function fetchBlueprintObjects(stageId: number, levelId: number) {
  const { data } = await createClient()
    .from("blueprint_object")
    .select("id, attributes, classname, character_id")
    .eq("level_id", levelId)
    .eq("stage_id", stageId);
  return data ?? [];
}

/** Fetches blueprint objects for a given level */
export function useGetBlueprintObjects(stageId: number, levelId: number) {
  return useQuery({
    queryKey: ["objects", stageId, levelId],
    queryFn: () => fetchBlueprintObjects(stageId, levelId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
