"use client";
import { getTeam } from "@/modules/team/actions";
import { InferAsync } from "@repo/utils";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export type UseTeamResult = UseQueryResult<
  InferAsync<ReturnType<typeof getTeam>>["data"]
>;

export function useTeam(teamId: string): UseTeamResult {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => (await getTeam(teamId))?.data,
  });
}
