import { useGetTeamFromParams } from "@/modules/modal/hooks";
import { TeamLeaveModalContent } from "@/modules/team/modals/leave/content";
import { Spinner } from "@repo/ui/components";

export function TeamLeaveModal() {
  const { data, error } = useGetTeamFromParams();
  if (error) throw new Error(error);
  if (!data) return <Spinner />;

  return <TeamLeaveModalContent {...data} />;
}
