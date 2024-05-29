import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/types";
import { nonNull } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";

async function fetchObjectsFromLevel(stageId: number, levelId: number) {
  return createClient()
    .from("blueprint_object")
    .select()
    .eq("stage_id", stageId)
    .eq("level_id", levelId);
}

async function fetchObjectsFromLevels(stageId: number, levels: number[]) {
  return (
    await Promise.all(
      levels.map((levelId) => fetchObjectsFromLevel(stageId, levelId)),
    )
  )
    .map((x) => x.data)
    .filter(nonNull);
}

export function useGetObjects(
  blueprintId: string,
  stageId: number,
  levelIds: number[],
) {
  return useQuery({
    queryKey: ["objects", blueprintId, stageId, ...levelIds],
    queryFn: async () => {
      const data = await fetchObjectsFromLevels(stageId, levelIds);
      const map = new Map<number, Tables<"blueprint_object">[]>();
      levelIds.forEach((levelId, i) => data[i] && map.set(levelId, data[i]));
      return map;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
