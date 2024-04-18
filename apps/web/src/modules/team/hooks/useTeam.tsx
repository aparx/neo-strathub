import { getTeam } from "@/modules/team/actions";
import { wait } from "@/utils/generic/wait";
import { useQuery } from "@tanstack/react-query";

export function useTeam(teamId: string) {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      await wait(3000);
      return (await getTeam(teamId))?.data;
    },
  });
}
