import type { TeamPageModalProps } from "@/app/(app)/dashboard/@modal/[teamId]/page";
import { getTeam } from "@/modules/team/actions";
import { Breadcrumbs, Modal } from "@repo/ui/components";

export async function TeamSettingsModal({ teamId }: TeamPageModalProps) {
  const { data: team } = await getTeam(teamId);
  if (!team) throw new Error("Could not load team");

  return (
    <Modal.Content>
      <Modal.Title>
        <Breadcrumbs
          breadcrumbs={[{ display: team.name }, { display: "Settings" }]}
        />
        <Modal.Exit />
      </Modal.Title>
      <Modal.Separator />
    </Modal.Content>
  );
}
