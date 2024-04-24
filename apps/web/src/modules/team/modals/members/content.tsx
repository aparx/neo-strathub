import { useUserContext } from "@/modules/auth/context";
import { getTeam } from "@/modules/team/actions";
import { RoleSelect } from "@/modules/team/modals/members/components";
import { wait } from "@/utils/generic";
import { createClient } from "@/utils/supabase/client";
import { Enums } from "@/utils/supabase/types";
import {
  BreadcrumbData,
  Breadcrumbs,
  Icon,
  IconButton,
  Modal,
  Table,
} from "@repo/ui/components";
import { InferAsync } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface TeamMembersModalProps {
  team: NonNullable<InferAsync<ReturnType<typeof getTeam>>["data"]>;
}

export function TeamMembersModalContent({ team }: TeamMembersModalProps) {
  const titlePath: BreadcrumbData[] = useMemo(
    () => [{ display: team.name }, { display: "Members" }],
    [team],
  );

  const { user } = useUserContext();

  const { isLoading, data } = useQuery({
    queryKey: ["teamMembers", team.id],
    queryFn: async () => {
      await wait(3000);
      return await createClient()
        .from("team_member")
        .select("*, profile(id, username)")
        .eq("profile_id", user!.id)
        .eq("team_id", team.id);
    },
  });

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
          {data?.data?.map((member) => (
            <MemberRow
              name={member.profile?.username ?? "(Anonymous)"}
              joinDate={new Date(member.created_at)}
              role={member.role}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </Modal.Content>
  );
}

function MemberRow({
  name,
  joinDate,
  role,
}: {
  name: string;
  joinDate: Date;
  role: Enums<"member_role">;
}) {
  return (
    <Table.Row>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>
        <RoleSelect initialRole={role} />
      </Table.Cell>
      <Table.Cell>{joinDate.toLocaleDateString()}</Table.Cell>
      <Table.Cell>
        <IconButton aria-label={"Edit"}>
          <Icon.Mapped type={"details"} />
        </IconButton>
      </Table.Cell>
    </Table.Row>
  );
}
