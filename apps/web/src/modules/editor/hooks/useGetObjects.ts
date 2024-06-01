import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

async function fetchObjects(stageId: number, levelId: number) {
  const { data } = await createClient()
    .from("blueprint_object")
    .select("id, attributes, classname")
    .eq("level_id", levelId)
    .eq("stage_id", stageId);
  return data ?? [];
}

/** Fetches blueprint objects for a given level */
export function useGetObjects(stageId: number, levelId: number) {
  return useQuery({
    queryKey: ["objects", stageId, levelId],
    queryFn: () => fetchObjects(stageId, levelId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
