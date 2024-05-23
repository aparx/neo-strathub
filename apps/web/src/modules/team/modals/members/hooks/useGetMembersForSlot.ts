import { createClient } from "@/utils/supabase/client";
import { InferAsync } from "@repo/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

async function fetchAssignedMemberSlots(slotId: number) {
  return createClient()
    .from("member_to_player_slot")
    .select("*, team_member!inner(profile!inner(id, name, avatar))")
    .eq("slot_id", slotId);
}

export function useGetMembersForSlot(
  slotId: number,
): UseQueryResult<InferAsync<ReturnType<typeof fetchAssignedMemberSlots>>> {
  return useQuery({
    queryKey: ["team", "playerSlotAssigns", slotId],
    queryFn: async () => await fetchAssignedMemberSlots(slotId),
  });
}
