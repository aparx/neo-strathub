import { useTeam } from "@/modules/team/clientActions";
import { useParams } from "next/navigation";

/** If possible, returns the team based off of the route parameters. */
export function useGetTeamFromParams() {
  const { teamId } = useParams<{ teamId: string }>();
  if (teamId == null) return { error: "Missing teamId", data: null };
  const { data, isLoading } = useTeam(teamId);
  if (isLoading) return { data: null, error: null };
  if (!data) return { data: null, error: "Could not find team" };
  return { data, error: null };
}
