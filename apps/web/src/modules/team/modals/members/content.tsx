import { useUserContext } from "@/modules/auth/context";
import { TeamMemberFlags, hasFlag } from "@/modules/auth/flags";
import { getTeam } from "@/modules/team/actions";
import {
  ROLE_SELECT_HEIGHT,
  RoleSelect,
  RoleSelectProps,
} from "@/modules/team/modals/members/components";
import { createClient } from "@/utils/supabase/client";
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
import { useMemo } from "react";
import * as css from "./content.css";

interface TeamMembersModalProps {
  team: NonNullable<InferAsync<ReturnType<typeof getTeam>>["data"]>;
}

function useGetMembers(profileId: string, teamId: string) {
  return useQuery({
    queryKey: ["teamMembers", teamId],
    queryFn: async () =>
      createClient()
        .from("team_member")
        .select("*, profile(id, username), team_member_role(id, flags)")
        .eq("profile_id", profileId)
        .eq("team_id", teamId),
  });
}

type TeamMember = NonNullable<
  NonNullable<ReturnType<typeof useGetMembers>["data"]>["data"]
>[number];

export function TeamMembersModalContent({ team }: TeamMembersModalProps) {
  const titlePath: BreadcrumbData[] = useMemo(
    () => [{ display: team.name }, { display: "Members" }],
    [team],
  );
  const { user } = useUserContext();
  const { isLoading, data } = useGetMembers(user!.id, team.id);
  const self = data?.data?.find((x) => x.profile_id === user?.id);

  return (
    <Modal.Content minWidth={600}>
      <Modal.Title>
        <Breadcrumbs breadcrumbs={titlePath} />
        <Modal.Exit />
      </Modal.Title>

      {/* TODO overview? */}

      <Table.Root className={css.table}>
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
              member={member}
              teamId={team.id}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </Modal.Content>
  );
}

interface MemberRowProps {
  member: TeamMember;
  teamId: string;
}

function MemberRow({ member, teamId }: MemberRowProps) {
  const flags = member.team_member_role?.flags;
  const joinDate = useMemo(
    () => new Date(member.created_at).toLocaleDateString(),
    [member.created_at],
  );
  const onRoleUpdate: RoleSelectProps["onRoleChange"] = async (newRole) => {
    if (!member) return;
    console.debug("#_onRoleUpdate", newRole, member.profile_id, teamId);
    await createClient()
      .from("team_member")
      .update({ role_id: member.role_id })
      .eq("profile_id", member.profile_id)
      .eq("team_id", teamId);
    // TODO error & success handling
  };

  return (
    <Table.Row>
      <Table.Cell>{member.profile?.username ?? "(Deleted)"}</Table.Cell>
      <Table.Cell>
        <RoleSelect
          width={110}
          initialRoleId={member.role_id}
          onRoleChange={onRoleUpdate}
          disabled={!hasFlag(flags, TeamMemberFlags.EDIT_MEMBERS)}
        />
      </Table.Cell>
      <Table.Cell>{joinDate}</Table.Cell>
      <Table.Cell>
        <IconButton
          aria-label={"Edit"}
          style={{ margin: "auto" }}
          disabled={!hasFlag(flags, TeamMemberFlags.KICK_MEMBERS)}
        >
          <Icon.Mapped type={"details"} />
        </IconButton>
      </Table.Cell>
    </Table.Row>
  );
}

function MemberRowSkeleton() {
  return (
    <Table.Row>
      {Array.from({ length: 4 }, (_, i) => (
        <Table.Cell key={i}>
          <Skeleton height={ROLE_SELECT_HEIGHT} />
        </Table.Cell>
      ))}
    </Table.Row>
  );
}
