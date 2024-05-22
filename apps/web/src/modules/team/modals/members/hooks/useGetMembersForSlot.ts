import { createClient } from "@/utils/supabase/client";
import { InferAsync } from "@repo/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

async function fetchAssignedMemberSlots(slotId: string) {
  return createClient()
    .from("player_slot_assign")
    .select("*, team_member!inner(profile!inner(id, username, avatar))")
    .eq("slot_id", slotId);
}

export function useGetMembersForSlot(
  slotId: string,
): UseQueryResult<InferAsync<ReturnType<typeof fetchAssignedMemberSlots>>> {
  return useQuery({
    queryKey: ["team", "playerSlotAssigns", slotId],
    queryFn: async () => await fetchAssignedMemberSlots(slotId),
  });
}
