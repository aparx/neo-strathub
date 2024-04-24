import { useUserContext } from "@/modules/auth/context";
import { getTeam } from "@/modules/team/actions";
import { RoleSelect } from "@/modules/team/modals/members/components";
import { createClient } from "@/utils/supabase/client";
import { Enums } from "@/utils/supabase/types";
import { vars } from "@repo/theme";
import {
  BreadcrumbData,
  Breadcrumbs,
  Icon,
  IconButton,
  Modal,
  Skeleton,
  Table,
} from "@repo/ui/components";
import { InferAsync } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";
import { calc } from "@vanilla-extract/css-utils";
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
          {isLoading
            ? Array.from({ length: 3 }, (_, index) => (
                <MemberRowSkeleton key={index} />
              ))
            : null}
          {data?.data?.map((member) => (
            <MemberRow
              key={member.profile_id}
              name={member.profile?.username ?? "(Anonymous)"}
              createdAt={member.created_at}
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
  createdAt,
  role,
}: {
  name: string;
  createdAt: string;
  role: Enums<"member_role">;
}) {
  const joinDate = useMemo(
    () => new Date(createdAt).toLocaleDateString(),
    [createdAt],
  );

  return (
    <Table.Row>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>
        <RoleSelect initialRole={role} />
      </Table.Cell>
      <Table.Cell>{joinDate}</Table.Cell>
      <Table.Cell>
        <IconButton aria-label={"Edit"}>
          <Icon.Mapped type={"details"} />
        </IconButton>
      </Table.Cell>
    </Table.Row>
  );
}

function MemberRowSkeleton() {
  // This is referencing the height of the `RoleSelect` component
  const maxHeight = calc.add(
    vars.fontSizes.label.md,
    calc.multiply(2, vars.spacing.md),
  );

  return (
    <Table.Row>
      {Array.from({ length: 4 }, (_, i) => (
        <Table.Cell key={i}>
          <Skeleton height={maxHeight} />
        </Table.Cell>
      ))}
    </Table.Row>
  );
}
