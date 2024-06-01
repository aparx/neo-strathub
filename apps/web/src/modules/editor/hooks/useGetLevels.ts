import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

async function fetchLevels(arenaId: number) {
  const { data } = await createClient()
    .from("arena_level")
    .select()
    .eq("arena_id", arenaId);
  return data ?? [];
}

/** Fetches all levels from an arena (provided by `arenaId`) */
export function useGetLevels(arenaId: number) {
  return useQuery({
    queryKey: ["levels", arenaId],
    queryFn: () => fetchLevels(arenaId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
