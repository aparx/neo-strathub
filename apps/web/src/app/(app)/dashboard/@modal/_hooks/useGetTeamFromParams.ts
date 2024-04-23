import { useTeam } from "@/modules/team/clientActions";
import { useParams } from "next/navigation";

export function useGetTeamFromParams() {
  const { teamId } = useParams<{ teamId: string }>();
  if (teamId == null) return { error: "Missing teamId", data: null };
  const { data, isLoading } = useTeam(teamId);
  if (isLoading) return { data: null, error: null };
  if (!data) return { error: "Could not find team", data: null };
  return { data, error: null };
}
