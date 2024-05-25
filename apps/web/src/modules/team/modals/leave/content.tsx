import { UseGetTeamFromParamsResultData } from "@/modules/modal/hooks";
import { useGetMembers } from "@/modules/team/modals/members/hooks";
import { vars } from "@repo/theme";
import {
  Breadcrumbs,
  Button,
  Flexbox,
  Modal,
  Spinner,
} from "@repo/ui/components";

export function TeamLeaveModalContent({
  id,
  name,
}: NonNullable<UseGetTeamFromParamsResultData>) {
  const membersQuery = useGetMembers(id);
  if (membersQuery.isLoading) return <Spinner />;

  const memberCount = membersQuery.data?.data?.length;
  const willDeleteTeam = memberCount === 1;

  return (
    <Modal.Content>
      <Modal.Title>
        <Breadcrumbs>
          {name}
          Leave
        </Breadcrumbs>
        <Modal.Exit />
      </Modal.Title>
      {willDeleteTeam && (
        <div>
          This will{" "}
          <strong style={{ color: vars.colors.destructive.lighter }}>
            permanently
          </strong>{" "}
          delete this team
        </div>
      )}
      <Flexbox gap={"md"} style={{ marginLeft: "auto" }}>
        <Modal.Close asChild>
          <Button color={"default"}>Cancel</Button>
        </Modal.Close>
        <Button color={"destructive"}>
          {willDeleteTeam ? "Delete" : "Leave"}
        </Button>
      </Flexbox>
    </Modal.Content>
  );
}
