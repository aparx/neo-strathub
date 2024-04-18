import { getTeam } from "@/modules/team/actions";
import { useQuery } from "@tanstack/react-query";

export function useTeam(teamId: string) {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => (await getTeam(teamId))?.data,
  });
}
