import { useUserContext } from "@/modules/auth/context";
import { TeamMemberFlags, hasFlag } from "@/modules/auth/flags";
import { deleteMember, getTeam } from "@/modules/team/actions";
import {
  ROLE_SELECT_HEIGHT,
  RoleSelect,
  RoleSelectProps,
} from "@/modules/team/modals/members/components";
import { time } from "@/utils/generic/time";
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
import { InferAsync, Nullish } from "@repo/utils";
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
        .eq("team_id", teamId),
    refetchOnWindowFocus: false,
  });
}

type TeamMember = NonNullable<
  NonNullable<ReturnType<typeof useGetMembers>["data"]>["data"]
>[number];

function sortMembers(members: Nullish<TeamMember[]>) {
  return members?.sort((a, b) => {
    const flagsA = a.team_member_role?.flags;
    const flagsB = b.team_member_role?.flags;
    return (flagsB ?? 0) - (flagsA ?? 0);
  });
}

export function TeamMembersModalContent({ team }: TeamMembersModalProps) {
  const titlePath: BreadcrumbData[] = useMemo(
    () => [{ display: team.name }, { display: "Members" }],
    [team],
  );
  const { user } = useUserContext();
  const { isLoading, data, refetch } = useGetMembers(user!.id, team.id);

  const [members, setMembers] = useState(data?.data);

  useEffect(() => setMembers(sortMembers(data?.data)), [data?.data]);

  async function removeMember(member: TeamMember) {
    console.time("#_removeMember");
    console.debug("#_removeMember", member);
    // TODO modal that asks if the removal is really what is wanted

    // Optimistic update, remove the member first
    setMembers((current) => {
      const newMembers = current ? [...current] : [];
      const index = newMembers.indexOf(member);
      if (index != null) newMembers.splice(index, 1);
      return newMembers;
    });

    const status = await deleteMember(member.profile_id, member.team_id);
    console.debug("removeMember", status);
    console.timeEnd("#_removeMember");

    // Refetch to ensure displayed data synchronicity and authenticity
    if (status.state === "error")
      refetch().then((newData) => setMembers(sortMembers(newData.data?.data)));
  }

  const self = useMemo(() => {
    return members?.find((x) => x.profile_id === user?.id);
  }, [members]);

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
            <MemberSlot
              key={member.profile_id}
              member={member}
              onRemove={time(() => removeMember(member), "removeMember")}
              self={self}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </Modal.Content>
  );
}

function MemberSlot({
  member,
  self,
  onRemove,
}: {
  member: TeamMember;
  /** The user themselves as a member, can be null when they are site admins */
  self: Nullish<TeamMember>;
  onRemove: () => any;
}) {
  const isUserThemselves = self?.profile_id === member.profile_id;
  const selfFlags = self?.team_member_role?.flags;
  const targetFlags = member.team_member_role?.flags;
  let canModify = hasFlag(selfFlags, TeamMemberFlags.EDIT_MEMBERS);
  let canKick = hasFlag(selfFlags, TeamMemberFlags.KICK_MEMBERS);

  if (selfFlags && targetFlags) {
    // Only allow modification of members when they have lower prioritisation
    const isSelfPrioritized = selfFlags > targetFlags;
    canModify &&= isSelfPrioritized;
    canKick &&= isSelfPrioritized;
  } else {
    // Only allow modification of members when they are not the user themselves
    canModify &&= !isUserThemselves;
    canKick &&= !isUserThemselves;
  }

  return (
    <MemberRow
      onRemove={onRemove}
      member={member}
      canModify={canModify}
      canKick={canKick}
    />
  );
}

function MemberRow({
  member: { created_at, profile_id, role_id, team_id, profile },
  canKick,
  canModify,
  onRemove,
}: {
  member: TeamMember;
  canKick?: boolean;
  canModify?: boolean;
  onRemove: () => any;
}) {
  const onRoleUpdate: RoleSelectProps["onRoleChange"] = async (newRole) => {
    console.debug("#_onRoleUpdate", newRole, profile_id, team_id);
    console.log(
      await createClient()
        .from("team_member")
        .update({ role_id: newRole.id })
        .eq("profile_id", profile_id)
        .eq("team_id", team_id),
    );
    // TODO error & success handling
  };

  return (
    <Table.Row>
      <Table.Cell>{profile?.username ?? "(Deleted)"}</Table.Cell>
      <Table.Cell>
        <RoleSelect
          width={110}
          initialRoleId={role_id}
          onRoleChange={onRoleUpdate}
          disabled={!canModify}
        />
      </Table.Cell>
      <Table.Cell>
        {useMemo(() => new Date(created_at).toLocaleDateString(), [created_at])}
      </Table.Cell>
      <Table.Cell>
        <IconButton
          aria-label={"Kick"}
          style={{ margin: "auto" }}
          disabled={!canKick}
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
