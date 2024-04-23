import { useGetTeamFromParams } from "@/modules/modal/hooks";
import { TeamSettingsModalContent } from "@/modules/team/modals/settings/content";
import { Spinner } from "@repo/ui/components";

export function TeamSettingsModal() {
  const { data, error } = useGetTeamFromParams();
  if (error) throw new Error(error);
  if (!data) return <Spinner />;

  return <TeamSettingsModalContent team={data} />;
}
