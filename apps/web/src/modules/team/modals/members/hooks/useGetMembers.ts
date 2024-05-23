import { createClient } from "@/utils/supabase/client";
import { InferAsync } from "@repo/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

async function fetchMembers(teamId: string) {
  return createClient()
    .from("team_member")
    .select(
      `*, 
       profile!inner(id, name, avatar), 
       member_role!inner(id, flags)`,
    )
    .eq("team_id", teamId);
}

type FetchMembersResult = InferAsync<ReturnType<typeof fetchMembers>>;

export type TeamMemberData = NonNullable<FetchMembersResult["data"]>[number];

export function useGetMembers(
  teamId: string,
): UseQueryResult<FetchMembersResult> {
  return useQuery({
    queryKey: ["team", "members", teamId],
    queryFn: async () => await fetchMembers(teamId),
    refetchOnWindowFocus: false,
  });
}
