import { useGetTeamFromParams } from "@/modules/modal/hooks";
import { DeepInferUseQueryResult } from "@/utils/generic/types";
import { createClient } from "@/utils/supabase/client";
import { Breadcrumbs, Modal, Table } from "@repo/ui/components";
import { useQuery } from "@tanstack/react-query";

export interface AuditLogModalContentProps {
  team: NonNullable<ReturnType<typeof useGetTeamFromParams>["data"]>;
}

function useGetLogEntries(teamId: string) {
  return useQuery({
    queryKey: ["auditLog", teamId],
    queryFn: async () =>
      await createClient()
        .from("audit_log")
        .select("*, profile(id, username)")
        .eq("team_id", teamId),
  });
}

type AuditLogEntry = DeepInferUseQueryResult<typeof useGetLogEntries>;

export function AuditLogModalContent({ team }: AuditLogModalContentProps) {
  const { data } = useGetLogEntries(team.id);

  return (
    <Modal.Content>
      <Modal.Title>
        <Breadcrumbs crumbs={[team.name, "Audit Log"]} />
        <Modal.Exit />
      </Modal.Title>
      <Table.Root>
        <Table.Head>
          <Table.HeadCell>Action</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Performer</Table.HeadCell>
          <Table.HeadCell>Message</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {data?.data?.map((entry) => <LogEntryRow {...entry} />)}
        </Table.Body>
      </Table.Root>
    </Modal.Content>
  );
}

function LogEntryRow(props: AuditLogEntry) {
  return (
    <Table.Row>
      <Table.Cell>{props.type}</Table.Cell>
      <Table.Cell>{props.created_at}</Table.Cell>
      <Table.Cell>{props.profile?.username ?? "(System)"}</Table.Cell>
      <Table.Cell>{props.message}</Table.Cell>
    </Table.Row>
  );
}
