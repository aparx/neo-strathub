import { PageModalProps } from "@/app/(app)/dashboard/@modal/modals";
import { getTeam } from "@/modules/team/actions";
import { TeamSettingsModalContent } from "@/modules/team/modals/settings/content";

export async function TeamSettingsModal({ params }: PageModalProps) {
  const teamId = params.teamId;
  if (teamId == null) throw new Error("Missing teamId parameter");

  const { data: team } = await getTeam(teamId);
  if (!team) throw new Error("Could not load team");

  return <TeamSettingsModalContent team={team} />;
}
