import { UserField } from "@/modules/auth/components";
import { UseGetTeamFromParamsResultData } from "@/modules/modal/hooks";
import { AuditLogType } from "@/modules/team/modals/auditLog/components";
import { DeepInferUseQueryResult } from "@/utils/generic/types";
import { createClient } from "@/utils/supabase/client";
import { Breadcrumbs, IconButton, Modal, Table } from "@repo/ui/components";
import { useInfiniteQuery } from "@tanstack/react-query";
import moment from "moment";
import { useMemo } from "react";

const LOG_PAGE_LIMIT = 10;

function useGetLogEntries(teamId: string) {
  return useInfiniteQuery({
    queryKey: ["auditLog", teamId],
    initialPageParam: 0,
    queryFn: async (context) => {
      const queryBuilder = createClient()
        .from("audit_log")
        .select("*, profile(id, name, avatar)")
        .eq("team_id", teamId)
        .order("id", { ascending: false })
        .limit(1 + LOG_PAGE_LIMIT);
      if (context.pageParam)
        // Apply the cursor
        queryBuilder.lte("id", context.pageParam);

      const { data: results } = await queryBuilder;

      let nextPageParam: number | undefined = undefined;
      const deleted = results?.splice(LOG_PAGE_LIMIT, 1);
      if (deleted?.length) nextPageParam = deleted[0]!.id;

      return {
        results: results ?? [],
        cursor: nextPageParam,
        hasNextPage: nextPageParam != null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
  });
}

type AuditLogEntry = DeepInferUseQueryResult<
  typeof useGetLogEntries
>["results"][number];

export function AuditLogModalContent(
  team: NonNullable<UseGetTeamFromParamsResultData>,
) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetLogEntries(team.id);

  const logs = useMemo(
    () => data?.pages?.flatMap((x) => x.results),
    [data?.pages],
  );

  return (
    <Modal.Content>
      <Modal.Title>
        <Breadcrumbs>
          {team.name}
          Audit Log
        </Breadcrumbs>
        <Modal.Exit />
      </Modal.Title>
      <Table.Root style={{ maxHeight: 400 }}>
        <Table.Head>
          <Table.HeadCell>Action</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Performer</Table.HeadCell>
          <Table.HeadCell>Message</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {logs?.map((entry) => <LogEntryRow key={entry.id} {...entry} />)}
        </Table.Body>
        {hasNextPage && (
          <IconButton
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            style={{ whiteSpace: "nowrap", margin: 5 }}
          >
            Load more...
          </IconButton>
        )}
      </Table.Root>
    </Modal.Content>
  );
}

function LogEntryRow({
  type,
  created_at,
  profile,
  message,
  performer_id,
}: AuditLogEntry) {
  return (
    <Table.Row>
      <Table.Cell>
        <AuditLogType type={type ?? "info"} />
      </Table.Cell>
      <Table.Cell style={{ whiteSpace: "nowrap" }}>
        {moment(created_at).format("YYYY-MM-DD HH:mm:ss")}
      </Table.Cell>
      <Table.Cell style={{ whiteSpace: "nowrap" }}>
        {profile ? (
          <UserField profile={profile} />
        ) : performer_id ? (
          "(Deleted)"
        ) : (
          "System"
        )}
      </Table.Cell>
      <Table.Cell style={{ maxWidth: "45ch" }}>{message}</Table.Cell>
    </Table.Row>
  );
}
