import { createClient } from "@/utils/supabase/client";
import { InferAsync } from "@repo/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

async function fetchSlotsFromMembers(teamId: string) {
  const { data } = await createClient()
    .from("member_to_player_slot")
    .select("*, player_slot!inner(id, team_id)")
    .eq("player_slot.team_id", teamId);
  return data;
}

export type MemberToPlayerSlotData = NonNullable<
  InferAsync<ReturnType<typeof fetchSlotsFromMembers>>
>[number];

export function useGetSlotsFromMembers(
  teamId: string,
): UseQueryResult<MemberToPlayerSlotData[] | null> {
  return useQuery({
    queryKey: ["team", "slotsFromMembers", teamId],
    queryFn: async () => await fetchSlotsFromMembers(teamId),
  });
}
