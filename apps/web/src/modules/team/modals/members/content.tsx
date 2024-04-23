import { getTeam } from "@/modules/team/actions";
import { BreadcrumbData, Breadcrumbs, Modal, Table } from "@repo/ui/components";
import { InferAsync } from "@repo/utils";
import { useMemo } from "react";

interface TeamMembersModalProps {
  team: NonNullable<InferAsync<ReturnType<typeof getTeam>>["data"]>;
}

export function TeamMembersModalContent({ team }: TeamMembersModalProps) {
  const titlePath: BreadcrumbData[] = useMemo(
    () => [{ display: team.name }, { display: "Members" }],
    [team],
  );

  return (
    <Modal.Content minWidth={600}>
      <Modal.Title>
        <Breadcrumbs breadcrumbs={titlePath} />
        <Modal.Exit />
      </Modal.Title>

      <Table.Root style={{ overflowY: "auto", maxHeight: 300 }}>
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>User</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Join date</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Lorem ipsum dolor</Table.Cell>
            <Table.Cell>Owner</Table.Cell>
            <Table.Cell>1st Jun 2022</Table.Cell>
            <Table.Cell>E</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Lorem ipsum dolor</Table.Cell>
            <Table.Cell>Owner</Table.Cell>
            <Table.Cell>1st Jun 2022</Table.Cell>
            <Table.Cell>E</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Lorem ipsum dolor</Table.Cell>
            <Table.Cell>Owner</Table.Cell>
            <Table.Cell>1st Jun 2022</Table.Cell>
            <Table.Cell>E</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Lorem ipsum dolor</Table.Cell>
            <Table.Cell>Owner</Table.Cell>
            <Table.Cell>1st Jun 2022</Table.Cell>
            <Table.Cell>E</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Lorem ipsum dolor</Table.Cell>
            <Table.Cell>Owner</Table.Cell>
            <Table.Cell>1st Jun 2022</Table.Cell>
            <Table.Cell>E</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Lorem ipsum dolor</Table.Cell>
            <Table.Cell>Owner</Table.Cell>
            <Table.Cell>1st Jun 2022</Table.Cell>
            <Table.Cell>E</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Modal.Content>
  );
}
