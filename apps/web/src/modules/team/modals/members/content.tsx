import { useUserContext } from "@/modules/auth/context";
import { TeamMemberFlags, hasFlag } from "@/modules/auth/flags";
import { getTeam } from "@/modules/team/actions";
import {
  ROLE_SELECT_HEIGHT,
  RoleSelect,
  RoleSelectProps,
} from "@/modules/team/modals/members/components";
import { createClient } from "@/utils/supabase/client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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
import { useEffect, useMemo, useState } from "react";
import { IoMdRemoveCircle } from "react-icons/io";
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
    refetchOnWindowFocus: false,
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
  const { isLoading, data, refetch } = useGetMembers(user!.id, team.id);

  const [members, setMembers] = useState(data?.data);

  useEffect(() => setMembers(data?.data), [data?.data]);

  async function removeMember(member: TeamMember) {
    // Optimistic update, remove the member first
    setMembers((current) => {
      const arrayCopy = current ? [...current] : [];
      const index = arrayCopy.indexOf(member);
      if (index != null) delete arrayCopy[index];
      return arrayCopy;
    });

    await createClient()
      .from("team_member")
      .delete()
      .eq("profile_id", member.profile_id)
      .eq("team_id", member.team_id);

    // Refetch to ensure displayed data synchronicity and authenticity
    refetch().then((newData) => setMembers(newData.data?.data));
  }

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
            <Table.HeadCell>
              <VisuallyHidden>Remove</VisuallyHidden>
            </Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {isLoading
            ? Array.from({ length: 3 }, (_, index) => (
                <MemberRowSkeleton key={index} />
              ))
            : null}
          {members?.map((member) => (
            <MemberRow
              key={member.profile_id}
              onRemove={() => removeMember(member)}
              {...member}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </Modal.Content>
  );
}

function MemberRow({
  team_member_role,
  created_at,
  profile_id,
  role_id,
  team_id,
  profile,
  onRemove,
}: TeamMember & {
  onRemove: () => any;
}) {
  const { user } = useUserContext();
  const flags = team_member_role?.flags;
  const joinDate = useMemo(
    () => new Date(created_at).toLocaleDateString(),
    [created_at],
  );
  const onRoleUpdate: RoleSelectProps["onRoleChange"] = async (newRole) => {
    console.debug("#_onRoleUpdate", newRole, profile_id, team_id);
    await createClient()
      .from("team_member")
      .update({ role_id })
      .eq("profile_id", profile_id)
      .eq("team_id", team_id);
    // TODO error & success handling
  };

  const isSelf = user?.id === profile_id;

  return (
    <Table.Row>
      <Table.Cell>{profile?.username ?? "(Deleted)"}</Table.Cell>
      <Table.Cell>
        <RoleSelect
          width={110}
          initialRoleId={role_id}
          onRoleChange={onRoleUpdate}
          disabled={!hasFlag(flags, TeamMemberFlags.EDIT_MEMBERS) || isSelf}
        />
      </Table.Cell>
      <Table.Cell>{joinDate}</Table.Cell>
      <Table.Cell>
        <IconButton
          aria-label={"Kick"}
          style={{ margin: "auto" }}
          disabled={!hasFlag(flags, TeamMemberFlags.KICK_MEMBERS) || isSelf}
          onClick={onRemove}
        >
          <Icon.Custom icon={<IoMdRemoveCircle />} />
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
