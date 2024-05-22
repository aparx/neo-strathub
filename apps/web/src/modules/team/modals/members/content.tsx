import { HelpButton } from "@/components";
import { UserField } from "@/modules/auth/components";
import { useUserContext } from "@/modules/auth/context";
import { TeamMemberFlags, hasFlag } from "@/modules/auth/flags";
import { deleteMember, getTeam } from "@/modules/team/actions";
import { updateMember } from "@/modules/team/modals/members/actions/updateMember";
import {
  ROLE_SELECT_HEIGHT,
  RemoveMemberButton,
  RoleSelect,
  RoleSelectProps,
} from "@/modules/team/modals/members/components";
import { MemberPlayerSlot } from "@/modules/team/modals/members/components/memberPlayerSlot";
import {
  TeamMemberData,
  useGetMembers,
} from "@/modules/team/modals/members/hooks";
import { AssignSlotModal } from "@/modules/team/modals/members/modals";
import { Tables } from "@/utils/supabase/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { vars } from "@repo/theme";
import {
  Breadcrumbs,
  Flexbox,
  Modal,
  Skeleton,
  Table,
} from "@repo/ui/components";
import { InferAsync, Nullish } from "@repo/utils";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as css from "./content.css";

interface TeamMembersModalProps {
  team: NonNullable<InferAsync<ReturnType<typeof getTeam>>["data"]>;
}

function sortMembers(members: Nullish<TeamMemberData[]>) {
  return members?.sort((a, b) => {
    return b.team_member_role.flags - a.team_member_role.flags;
  });
}

export function TeamMembersModalContent({ team }: TeamMembersModalProps) {
  const { user } = useUserContext();
  const { isLoading, data, refetch } = useGetMembers(team.id);

  const [members, setMembers] = useState(data?.data);

  useEffect(() => setMembers(sortMembers(data?.data)), [data?.data]);

  const removeMember = useCallback(async (member: TeamMemberData) => {
    console.debug("#_removeMember", "invoke", member);

    // Optimistic update, remove the actions first
    setMembers((current) => {
      const newMembers = current ? [...current] : [];
      const index = newMembers.indexOf(member);
      if (index != null) newMembers.splice(index, 1);
      return newMembers;
    });

    await deleteMember(member).catch((e) => {
      console.error("#_removeMember", "error", e);
      // Refetch to ensure displayed data synchronicity and authenticity
      refetch().then(({ data }) => setMembers(sortMembers(data?.data)));
    });
  }, []);

  const updateRole = useCallback(
    async (member: TeamMemberData, role: Tables<"team_member_role">) => {
      console.debug("#_updateMember", "invoke", member, role);

      await updateMember(member, role.id).catch((e) => {
        console.error("#_updateMember", "error", e);
        // TODO error handling, toast?
      });
    },
    [],
  );

  const self = useMemo(
    () => members?.find((x) => x.profile_id === user?.id),
    [members],
  );

  return (
    <Modal.Content minWidth={700}>
      <Modal.Title>
        <Breadcrumbs>
          {team.name}
          Members
        </Breadcrumbs>
        <Modal.Exit />
      </Modal.Title>

      <Table.Root className={css.table}>
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>User</Table.HeadCell>
            <Table.HeadCell style={{ position: "relative" }}>
              <Flexbox align={"center"}>
                Slot
                <HelpButton.Root>
                  <HelpButton.Trigger />
                  <HelpButton.Content>
                    A player slot is a slot to which multiple members of a team
                    can be assigned and colored, so that they can be used in
                    blueprints. It makes swapping players very easy.
                  </HelpButton.Content>
                </HelpButton.Root>
              </Flexbox>
            </Table.HeadCell>
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
              onRemove={() => removeMember(member)}
              onUpdate={(newRole) => updateRole(member, newRole)}
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
  onUpdate,
}: {
  member: TeamMemberData;
  /** The user themselves as a actions, can be null when they are site admins */
  self: Nullish<TeamMemberData>;
  onRemove: () => any;
  onUpdate: RoleSelectProps["onSelect"];
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
  }

  canKick ||= isUserThemselves;

  return (
    <MemberRow
      onRemove={onRemove}
      onUpdate={onUpdate}
      member={member}
      canModify={canModify}
      canKick={canKick}
    />
  );
}

function MemberRow({
  member,
  canKick,
  canModify,
  onRemove,
  onUpdate,
}: {
  member: TeamMemberData;
  canKick?: boolean;
  canModify?: boolean;
  onRemove: () => any;
  onUpdate: RoleSelectProps["onSelect"];
}) {
  const { created_at, role_id } = member;

  return (
    <Table.Row>
      <Table.Cell>
        <UserField profile={member.profile} />
      </Table.Cell>
      <Table.Cell>
        <Modal.Root>
          <Modal.Trigger asChild>
            <MemberPlayerSlot memberId={member.id} />
          </Modal.Trigger>
          <AssignSlotModal member={member} />
        </Modal.Root>
      </Table.Cell>
      <Table.Cell>
        <RoleSelect
          width={100}
          initialRoleId={role_id}
          onSelect={onUpdate}
          disabled={!canModify}
        />
      </Table.Cell>
      <Table.Cell>
        {useMemo(
          () => moment(created_at).format("YYYY-MM-DD HH:mm"),
          [created_at],
        )}
      </Table.Cell>
      <Table.Cell>
        <RemoveMemberButton
          disabled={!canKick}
          onConfirm={onRemove}
          userField={
            <UserField
              profile={member.profile}
              style={{ color: vars.colors.emphasis.high }}
            />
          }
        />
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
