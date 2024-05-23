import { createClient } from "@/utils/supabase/client";
import { InferAsync } from "@repo/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

async function fetchMemberSlots(teamId: string) {
  return createClient().from("player_slot").select().eq("team_id", teamId);
}

type FetchMemberSlotsResult = InferAsync<ReturnType<typeof fetchMemberSlots>>;

export type MemberSlotData = NonNullable<
  FetchMemberSlotsResult["data"]
>[number];

export function useGetMemberSlots(
  teamId: string,
): UseQueryResult<InferAsync<ReturnType<typeof fetchMemberSlots>>> {
  return useQuery({
    queryKey: ["team", "memberSlots", teamId],
    queryFn: async () => await fetchMemberSlots(teamId),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
}
