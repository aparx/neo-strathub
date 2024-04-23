import { useGetTeamFromParams } from "@/modules/modal/hooks";
import { Breadcrumbs, Modal, Spinner } from "@repo/ui/components";

export function TeamMembersModal() {
  const { data, error } = useGetTeamFromParams();
  if (error) throw new Error(error);
  if (!data) return <Spinner />;

  return (
    <Modal.Content>
      <Modal.Title>
        <Breadcrumbs
          breadcrumbs={[{ display: data.name }, { display: "Members" }]}
        />
        <Modal.Exit />
      </Modal.Title>
      <Modal.Separator />
    </Modal.Content>
  );
}
