import { PageModalProps } from "@/app/(app)/dashboard/@modal/modals";
import { getTeam } from "@/modules/team/actions";
import { Breadcrumbs, Modal } from "@repo/ui/components";

export async function TeamMembersModal({ params }: PageModalProps) {
  const teamId = params.teamId;
  if (teamId == null) throw new Error("Missing teamId parameter");

  const { data: team } = await getTeam(teamId);
  if (!team) throw new Error("Could not load team");

  return (
    <Modal.Content>
      <Modal.Title>
        <Breadcrumbs
          breadcrumbs={[{ display: team.name }, { display: "Members" }]}
        />
        <Modal.Exit />
      </Modal.Title>
      <Modal.Separator />
    </Modal.Content>
  );
}
